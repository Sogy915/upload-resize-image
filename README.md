## image upload and resize API

## backend API built with **TypeScript**, **Express**, **multer** and **Sharp** that enables users to upload an image, resize it with custom width and height, and retrieve the resized version. It also includes unit testing with **Jasmine** and **Supertest**.

## project structure

project/
├── src/
│ ├── routes/
│ │ └── imageRoutes.ts
│ ├── utilities/
│ │ └── sharp.ts
│ ├── middlewares/
│ │ └── upload.ts
│ └── index.ts
├── spec/
│ └── imgEndpoint.spec.ts
├── uploads/ <-- uploaded images will be stored here
├── resized/ <-- resized images will be stored here
├── dist/ <-- compiled JS files
├── README.md
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── .prettierrc

## how to run the backend

1. **Install dependencies:**
   ```bash
    npm install

2. **run the server (dev)**
    npm run dev

3. **test with jasmine**
    npm run test

4. **API endpoints(test it with postman)**
    ## upload :
        > POST /api/upload
        > Form-data field: image (type: file)
        > response: 
                        {
                    "message": "File uploaded successfully!",
                    "filename": "example-123456.jpg",
                    "path": "uploads/example-123456.jpg"
                        }

    ## Resize :
        > GET /api/resize?filename=example.jpg&width=300&height=300
        > Query Parameters:
            .. file name
            .. width
            .. length
        > Response: Resized image will be returned.

## by : Sagda Walid
