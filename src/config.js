const dev = {
    API_URL: "http://localhost:8000"
}

const prod = {
    API_URL: "https://www.yourDomain.com",
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;