module.exports = {
    server_port: 4000,
    db_url: 'mongodb://localhost:27017/local',
    db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./group_schema', collection:'groups',
        schemaName:'GroupSchema', modelName:'GroupModel'},
        {file:'./config_schema', collection:'config',
        schemaName:'ConfigSchema', modelName:'ConfigModel'}
    ],
    jsonrpc_api_path: '/api',
}