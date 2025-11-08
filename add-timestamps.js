const { Client } = require('pg');

async function addTimestampColumns() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_IUhFu58zeAtg@ep-billowing-wind-ahoqjm4d-pooler.c-3.us-east-1.aws.neon.tech/teste",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar se as colunas created_at e updated_at existem
    const columnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('created_at', 'updated_at')
    `);

    const existingColumns = columnsCheck.rows.map(row => row.column_name);
    console.log('Colunas existentes:', existingColumns);

    // Adicionar created_at se não existir
    if (!existingColumns.includes('created_at')) {
      console.log('\n🔧 Adicionando coluna created_at...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `);
      
      // Atualizar registros existentes
      await client.query(`
        UPDATE users 
        SET created_at = NOW() 
        WHERE created_at IS NULL
      `);
      
      // Tornar a coluna NOT NULL
      await client.query(`
        ALTER TABLE users 
        ALTER COLUMN created_at SET NOT NULL
      `);
      
      console.log('✅ Coluna created_at adicionada');
    }

    // Adicionar updated_at se não existir
    if (!existingColumns.includes('updated_at')) {
      console.log('\n🔧 Adicionando coluna updated_at...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `);
      
      // Atualizar registros existentes
      await client.query(`
        UPDATE users 
        SET updated_at = NOW() 
        WHERE updated_at IS NULL
      `);
      
      // Tornar a coluna NOT NULL
      await client.query(`
        ALTER TABLE users 
        ALTER COLUMN updated_at SET NOT NULL
      `);
      
      console.log('✅ Coluna updated_at adicionada');
    }

    // Verificar estrutura final
    console.log('\n📋 Estrutura final da tabela users:');
    const finalStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.table(finalStructure.rows);

    // Verificar dados
    console.log('\n📊 Dados na tabela users:');
    const userData = await client.query('SELECT id, email, role, created_at, updated_at FROM users LIMIT 5');
    console.table(userData.rows);

    console.log('\n✅ Colunas de timestamp adicionadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

addTimestampColumns();