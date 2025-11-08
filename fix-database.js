const { Client } = require('pg');

async function fixDatabase() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_IUhFu58zeAtg@ep-billowing-wind-ahoqjm4d-pooler.c-3.us-east-1.aws.neon.tech/teste",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar estrutura da tabela users
    console.log('\n📋 Estrutura atual da tabela users:');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.table(tableInfo.rows);

    // Verificar dados existentes
    console.log('\n📊 Dados existentes na tabela users:');
    const userData = await client.query('SELECT id, email, role, created_at, updated_at FROM users LIMIT 10');
    console.table(userData.rows);

    // Verificar se há registros com created_at NULL
    const nullCreatedAt = await client.query('SELECT COUNT(*) as count FROM users WHERE created_at IS NULL');
    console.log(`\n⚠️  Registros com created_at NULL: ${nullCreatedAt.rows[0].count}`);

    // Se há registros com created_at NULL, vamos corrigir
    if (parseInt(nullCreatedAt.rows[0].count) > 0) {
      console.log('\n🔧 Corrigindo registros com created_at NULL...');
      
      // Atualizar registros existentes com created_at NULL
      await client.query(`
        UPDATE users 
        SET created_at = NOW(), updated_at = NOW() 
        WHERE created_at IS NULL OR updated_at IS NULL
      `);
      
      console.log('✅ Registros corrigidos');
    }

    // Verificar se a coluna created_at existe e é NOT NULL
    const createdAtColumn = await client.query(`
      SELECT is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'created_at'
    `);

    if (createdAtColumn.rows.length > 0 && createdAtColumn.rows[0].is_nullable === 'YES') {
      console.log('\n🔧 Alterando coluna created_at para NOT NULL...');
      await client.query('ALTER TABLE users ALTER COLUMN created_at SET NOT NULL');
      console.log('✅ Coluna created_at alterada para NOT NULL');
    }

    // Fazer o mesmo para updated_at
    const updatedAtColumn = await client.query(`
      SELECT is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'updated_at'
    `);

    if (updatedAtColumn.rows.length > 0 && updatedAtColumn.rows[0].is_nullable === 'YES') {
      console.log('\n🔧 Alterando coluna updated_at para NOT NULL...');
      await client.query('ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL');
      console.log('✅ Coluna updated_at alterada para NOT NULL');
    }

    console.log('\n✅ Banco de dados corrigido com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

fixDatabase();