import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Quiz Game API",
            version: "1.0.0",
            description: "API documentation for the real-time quiz game"
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;