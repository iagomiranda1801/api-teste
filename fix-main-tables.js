const { Client } = require('pg');

async function fixMainTables() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_IUhFu58zeAtg@ep-billowing-wind-ahoqjm4d-pooler.c-3.us-east-1.aws.neon.tech/teste",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar e corrigir apenas as tabelas principais (não SequelizeMeta)
    const mainTables = ['clients', 'subscriptions'];

    for (const tableName of mainTables) {
      console.log(`\n🔍 Verificando tabela: ${tableName}`);
      
      // Verificar se a tabela existe
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = '${tableName}'
        )
      `);

      if (!tableExists.rows[0].exists) {
        console.log(`⚠️  Tabela ${tableName} não existe, pulando...`);
        continue;
      }
      
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = '${tableName}'
        ORDER BY ordinal_position
      `);
      
      console.table(columns.rows);
      
      const columnNames = columns.rows.map(col => col.column_name);
      const hasCreatedAt = columnNames.includes('created_at');
      const hasUpdatedAt = columnNames.includes('updated_at');
      
      console.log(`   created_at: ${hasCreatedAt ? '✅' : '❌'}`);
      console.log(`   updated_at: ${hasUpdatedAt ? '✅' : '❌'}`);
      
      // Se não tem as colunas de timestamp, adicionar
      if (!hasCreatedAt || !hasUpdatedAt) {
        console.log(`\n🔧 Adicionando colunas de timestamp para ${tableName}...`);
        
        if (!hasCreatedAt) {
          await client.query(`
            ALTER TABLE "${tableName}" 
            ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          `);
          
          await client.query(`
            UPDATE "${tableName}" 
            SET created_at = NOW() 
            WHERE created_at IS NULL
          `);
          
          await client.query(`
            ALTER TABLE "${tableName}" 
            ALTER COLUMN created_at SET NOT NULL
          `);
          
          console.log(`✅ Coluna created_at adicionada para ${tableName}`);
        }
        
        if (!hasUpdatedAt) {
          await client.query(`
            ALTER TABLE "${tableName}" 
            ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          `);
          
          await client.query(`
            UPDATE "${tableName}" 
            SET updated_at = NOW() 
            WHERE updated_at IS NULL
          `);
          
          await client.query(`
            ALTER TABLE "${tableName}" 
            ALTER COLUMN updated_at SET NOT NULL
          `);
          
          console.log(`✅ Coluna updated_at adicionada para ${tableName}`);
        }
      }
    }

    console.log('\n✅ Todas as tabelas principais foram verificadas e corrigidas!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

fixMainTables();