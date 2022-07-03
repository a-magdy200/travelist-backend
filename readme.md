# Travelist

### Configurations

Create `.env` file similar to `.env.example`
```dotenv
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=travelist_user
DATABASE_PASS=travelist
DATABASE_NAME=travelistdb
```

### Running
`yarn start`

## Guides

### Logging
``  
logger.log("severity", "message");
``
```
Severity Values: error, warn, info, verbose, debug, silly
```

### Typeorm
```typescript
await AppDataSource.manager.insert<Country>(Country, {
  // ...
});
const countries = await AppDataSource.manager.find<Country>(Country);
```

### Hashing
Hashing using [BCrypt](https://github.com/kelektiv/node.bcrypt.js)