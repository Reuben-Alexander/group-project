const config = {
    env: import.meta.env.MODE || 'development',
    port: import.meta.env.PORT || 3001,
    jwtSecret: import.meta.env.VITE_JWT_SECRET || "YOUR_secret_key",
    mongoUri: import.meta.env.VITE_MONGODB_URI || "mongodb+srv://joeyweee:520520Shi@cluster0.qhnik17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || 'mongodb://' + (import.meta.env.VITE_IP || 'localhost') + ':' + (import.meta.env.VITE_MONGO_PORT || '27017') + '/mernproject',
    apiBaseUrl: import.meta.env.MODE === 'production' ? 'https://jaxz-group.onrender.com' : 'http://localhost:3000'
};

export default config;
