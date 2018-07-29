module.exports = {
    SERVER_PORT: 5000,
    DB_URL: 'mongodb://localhost:27017/local',
    DB_SCHEMAS: [
        {file:'./user_schema', collection: 'users', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./memo_schema', collection: 'memos', schemaName:'MemoSchema', modelName:'MemoModel'},
    ],
    JSONRPC_API_PATH: 'api',
    
}