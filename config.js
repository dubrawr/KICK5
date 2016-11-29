exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                       	// need to include this to host for heroku:
                            'mongodb://deb:lolpassword@ds061365.mlab.com:61365/mean' :
                            'mongodb://deb:lolpassword@ds061365.mlab.com:61365/mean');
exports.PORT = process.env.PORT || 3000;