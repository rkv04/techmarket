<?php

namespace App\Exceptions;

use Exception;

class AuthException extends Exception {
    const EMAIL_NOT_FOUND = 0;
    const INVALID_CREDENTIALS = 1;
}