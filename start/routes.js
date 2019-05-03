'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route');
Route.get('users/profile', 'UserController.getProfile');

Route.resource('users', 'UserController').apiOnly();
Route.resource('projects', 'ProjectController').apiOnly();
Route.post('/login', 'UserController.login');
Route.get('/doc', 'DocumentController.uploadFile');


