var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
    local: {
        email: {
            type: String,
        },
        password: {
            type: String
        },

    },
    facebook: {
        id: String,
        token: String,
    },
    twitter: {
        id: String,
        token: String,
    },
    google: {
        id: String,
        token: String,
    },

    email: {
        type: String,
        unique: true
    },
    name: String,

    picture: {
        binaryData: Buffer,
        contentType: String
    }
}, {
    toObject: {
        virtuals: true
    }
});



// virtuals // 2
userSchema.virtual("passwordConfirmation")
    .get(function() {
        return this._passwordConfirmation;

    })
    .set(function(value) {
        this._passwordConfirmation = value;
    });

userSchema.virtual("originalPassword")
    .get(function() {
        return this._originalPassword;
    })
    .set(function(value) {
        this._originalPassword = value;
    });

userSchema.virtual("currentPassword")
    .get(function() {
        return this._currentPassword;
    })
    .set(function(value) {
        this._currentPassword = value;
    });

userSchema.virtual("newPassword")
    .get(function() {
        return this._newPassword;
    })
    .set(function(value) {
        this._newPassword = value;
    });

// password validation // 3
userSchema.path("local.password").validate(function(v) {
    var user = this;

    // create user
    if (user.isNew) {
        if (!user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation is required!");
        }
        if (user.local.password !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
        }
    }

    // update user
    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate("currentPassword", "Current Password is required!");
        }
        if (user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
            user.invalidate("currentPassword", "Current Password is invalid!");
        }
        if (user.newPassword !== user.passwordConfirmation) {
            user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
        }
    }
});

userSchema.pre("save", function(next) {
    var user = this;
    if (!user.isModified("local.password")) {
        return next();
    } else {
        user.local.password = bcrypt.hashSync(user.local.password);
        return next();
    }
});


userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hash = function(password) {
    return bcrypt.hashSync(password);
};

// model & export
var User = mongoose.model("users", userSchema);
module.exports = User;
