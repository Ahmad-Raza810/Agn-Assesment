package com.assesment.backend.execption;

import com.assesment.backend.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.core.NestedExceptionUtils.getMostSpecificCause;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. @Valid request body validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage()
                )
        );
        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "validation failed",
                errors,
                HttpStatus.BAD_REQUEST.value()
        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // 2. Invalid JSON or incompatible JSON data types
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRequestBody(
            HttpMessageNotReadableException ex) {
        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "Request body is missing or invalid",
                null,
                HttpStatus.BAD_REQUEST.value()
        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

//    // 3. Missing query parameter
//    @ExceptionHandler(MissingServletRequestParameterException.class)
//    public ResponseEntity<ApiErrorResponse> handleMissingParameter(
//            MissingServletRequestParameterException ex) {
//
//    }

//    // 4. Wrong parameter type, e.g. /enquiries/abc when ID is Long
//    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
//    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
//            MethodArgumentTypeMismatchException ex,
//            HttpServletRequest request) {
//
//
//    }


//    // 5. Validation errors on method parameters or path variables
//    @ExceptionHandler(ConstraintViolationException.class)
//    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
//            ConstraintViolationException ex,
//            HttpServletRequest request) {
//
//        Map<String, String> errors = new LinkedHashMap<>();
//
//        ex.getConstraintViolations().forEach(violation ->
//                errors.put(
//                        violation.getPropertyPath().toString(),
//                        violation.getMessage()
//                )
//        );
//
//
//    }

    // 6. Invalid login credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex) {
            ApiErrorResponse errorResponse=new ApiErrorResponse(
                    "Invalid login credentials",
                    null,
                    HttpStatus.BAD_REQUEST.value()
            );
            return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);


    }

    // 7. Other authentication failures thrown inside controller execution
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
            AuthenticationException ex) {

        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "authentication related failure",
                null,
                HttpStatus.BAD_REQUEST.value()
        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

    }

//    // 8. Database constraint violations
//    @ExceptionHandler(DataIntegrityViolationException.class)
//    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
//            DataIntegrityViolationException ex,
//            HttpServletRequest request) {
//
//
//    }

    // 9. Unsupported HTTP method, e.g. POST instead of GET
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException ex) {

        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "Unsupported HTTP method",
                null,
                HttpStatus.BAD_REQUEST.value()

        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);



    }

    // 10. Endpoint/resource not found
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            NoResourceFoundException ex,
            HttpServletRequest request) {

        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "Endpoint/resource not found",
                null,
                HttpStatus.BAD_REQUEST.value()
        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);


    }

    // 11. Any other unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(
            Exception ex) {

        ApiErrorResponse errorResponse=new ApiErrorResponse(
                "unexpected exception",
                null,
                HttpStatus.BAD_REQUEST.value()
        );
        return  new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
