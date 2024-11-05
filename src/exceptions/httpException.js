class HttpException extends Error {
    status;
    message;
    error;
    time;

    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = true;
        this.time = new Date();
    }
}

export default HttpException;