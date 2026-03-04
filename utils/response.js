/**
 * Send a standardised success response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {number}  [options.status=200]  - HTTP status code
 * @param {string}  options.message        - Human-readable success message
 * @param {*}       [options.data]         - Payload (omitted if null/undefined)
 */
function success(res, { status = 200, message, data } = {}) {
    const body = { success: true, message };
    if (data !== undefined && data !== null) body.data = data;
    return res.status(status).json(body);
}

/**
 * Send a standardised error response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {number}  [options.status=500]  - HTTP status code
 * @param {string}  options.message        - Human-readable error message
 */
function error(res, { status = 500, message = 'Internal server error' } = {}) {
    return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
