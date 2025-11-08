const { Client } = require('pg');

async function checkAllTables() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_IUhFu58zeAtg@ep-billowing-wind-ahoqjm4d-pooler.c-3.us-east-1.aws.neon.tech/teste",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar todas as tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

    console.log('\n📋 Tabelas existentes:');
    console.table(tables.rows);

    // Para cada tabela, verificar se tem colunas de timestamp
    for (const table of tables.rows) {
      const tableName = table.table_name;
      console.log(`\n🔍 Verificando tabela: ${tableName}`);
      
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
            ALTER TABLE ${tableName} 
            ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          `);
          
          await client.query(`
            UPDATE ${tableName} 
            SET created_at = NOW() 
            WHERE created_at IS NULL
          `);
          
          await client.query(`
            ALTER TABLE ${tableName} 
            ALTER COLUMN created_at SET NOT NULL
          `);
        }
        
        if (!hasUpdatedAt) {
          await client.query(`
            ALTER TABLE ${tableName} 
            ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          `);
          
          await client.query(`
            UPDATE ${tableName} 
            SET updated_at = NOW() 
            WHERE updated_at IS NULL
          `);
          
          await client.query(`
            ALTER TABLE ${tableName} 
            ALTER COLUMN updated_at SET NOT NULL
          `);
        }
        
        console.log(`✅ Colunas adicionadas para ${tableName}`);
      }
    }

    console.log('\n✅ Verificação completa!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkAllTables();