/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../../controllers/userController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserAdminController } from './../../controllers/userAdminController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../../controllers/authController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "users": {"dataType":"array","array":{"dataType":"any"}},
            "user": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CheckUserInfoSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"provider":{"dataType":"string","required":true},"lastLoginAt":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},"displayName":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"isFirstLoginCompleted":{"dataType":"boolean","required":true},"registrationDate":{"dataType":"datetime","required":true},"authority":{"dataType":"string","required":true},"status":{"dataType":"string","required":true},"emailAddress":{"dataType":"string","required":true},"lastNameKana":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"firstNameKana":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompleteFirstLoginSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"isFirstLoginCompleted":{"dataType":"boolean","required":true},"displayName":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompleteFirstLoginRequest": {
        "dataType": "refObject",
        "properties": {
            "displayName": {"dataType":"string","required":true},
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "firstNameKana": {"dataType":"string"},
            "lastNameKana": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateDisplayNameSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"displayName":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateDisplayNameRequest": {
        "dataType": "refObject",
        "properties": {
            "displayName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProfileSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"displayName":{"dataType":"string","required":true},"lastNameKana":{"dataType":"string","required":true},"firstNameKana":{"dataType":"string","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "firstNameKana": {"dataType":"string","required":true},
            "lastNameKana": {"dataType":"string","required":true},
            "displayName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"displayName":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"isFirstLoginCompleted":{"dataType":"boolean","required":true},"registrationDate":{"dataType":"string","required":true},"authority":{"dataType":"string","required":true},"status":{"dataType":"string","required":true},"emailAddress":{"dataType":"string","required":true},"lastNameKana":{"dataType":"string","required":true},"firstNameKana":{"dataType":"string","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserAuthority": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["globalAdmin"]},{"dataType":"enum","enums":["serviceAdmin"]},{"dataType":"enum","enums":["readonlyAdmin"]},{"dataType":"enum","enums":["user"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["inactive"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserRequest": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "firstNameKana": {"dataType":"string","required":true},
            "lastNameKana": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "authority": {"ref":"UserAuthority","required":true},
            "status": {"ref":"UserStatus"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"displayName":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"isFirstLoginCompleted":{"dataType":"boolean","required":true},"registrationDate":{"dataType":"string","required":true},"authority":{"dataType":"string","required":true},"status":{"dataType":"string","required":true},"emailAddress":{"dataType":"string","required":true},"lastNameKana":{"dataType":"string","required":true},"firstNameKana":{"dataType":"string","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserRequest": {
        "dataType": "refObject",
        "properties": {
            "originalEmail": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "firstNameKana": {"dataType":"string","required":true},
            "lastNameKana": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "authority": {"ref":"UserAuthority","required":true},
            "status": {"ref":"UserStatus"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteUserSuccessResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteUserRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyTokenResponse": {
        "dataType": "refObject",
        "properties": {
            "idToken": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"hd":{"dataType":"string"},"family_name":{"dataType":"string"},"given_name":{"dataType":"string"},"picture":{"dataType":"string"},"name":{"dataType":"string"},"email_verified":{"dataType":"boolean","required":true},"email":{"dataType":"string","required":true},"sub":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyTokenRequest": {
        "dataType": "refObject",
        "properties": {
            "accessToken": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_getUserInfo: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/userinfo',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserInfo)),

            async function UserController_getUserInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserInfo, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_checkUserInfo: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                recordLogin: {"in":"query","name":"recordLogin","dataType":"boolean"},
        };
        app.get('/api/check-user-info',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.checkUserInfo)),

            async function UserController_checkUserInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_checkUserInfo, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'checkUserInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_completeFirstLogin: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CompleteFirstLoginRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/api/first-login',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.completeFirstLogin)),

            async function UserController_completeFirstLogin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_completeFirstLogin, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'completeFirstLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateDisplayName: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateDisplayNameRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/api/display-name',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateDisplayName)),

            async function UserController_updateDisplayName(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateDisplayName, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateDisplayName',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateProfileRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/api/profile',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateProfile)),

            async function UserController_updateProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserAdminController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/admin/users',
            ...(fetchMiddlewares<RequestHandler>(UserAdminController)),
            ...(fetchMiddlewares<RequestHandler>(UserAdminController.prototype.getAllUsers)),

            async function UserAdminController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserAdminController_getAllUsers, request, response });

                const controller = new UserAdminController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserAdminController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateUserRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/admin/users',
            ...(fetchMiddlewares<RequestHandler>(UserAdminController)),
            ...(fetchMiddlewares<RequestHandler>(UserAdminController.prototype.createUser)),

            async function UserAdminController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserAdminController_createUser, request, response });

                const controller = new UserAdminController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserAdminController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateUserRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/api/admin/users',
            ...(fetchMiddlewares<RequestHandler>(UserAdminController)),
            ...(fetchMiddlewares<RequestHandler>(UserAdminController.prototype.updateUser)),

            async function UserAdminController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserAdminController_updateUser, request, response });

                const controller = new UserAdminController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserAdminController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"DeleteUserRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/api/admin/users',
            ...(fetchMiddlewares<RequestHandler>(UserAdminController)),
            ...(fetchMiddlewares<RequestHandler>(UserAdminController.prototype.deleteUser)),

            async function UserAdminController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserAdminController_deleteUser, request, response });

                const controller = new UserAdminController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_verifyGoogleToken: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"VerifyTokenRequest"},
        };
        app.post('/auth/google/verify',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyGoogleToken)),

            async function AuthController_verifyGoogleToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verifyGoogleToken, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyGoogleToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
