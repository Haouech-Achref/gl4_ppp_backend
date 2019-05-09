'use strict';
const Helpers = use("Helpers");

const Project = use('App/Models/Project');


/**
 * Controller to manage projects
 */
class ProjectController {
  /**
   * GET: /projects
   * Returns all projects
   */
  async index({request}) {
    const queryParams = request.get();

    return await Project.query().where(queryParams).fetch();
  }

  /**
 * GET: /projects/:id
 * Returns a single project
 */
  async show({params}) {
    return await Project.query().where({_id: params.id}).first();
  }

  /**
   * Returns projects of the user
   * @param {*} param0
   */
  async getUserProjects({auth}) {
    const Database = use('Database');
    const db = await Database.connect('prince2');
    const user = await auth.getUser();
    const projects = await db.collection('projects').find({
      collaborators: {$elemMatch: {collaboratorId: user._id.toString()}},
    }).toArray();
    return projects;
  }


  /**
 * POST: /projects
 * Creates a project
 */
  async store({request}) {
    //const project = new Project(request.all());
    console.log('test');
    var project = new Project();
    project.name = request.input('name');
    project.startDate = request.input('startDate');
    project.endDate = request.input('endDate');
    project.description = request.input('description');

    var collaboratorIds = request.input('collaborators');
    var roles = request.input('roles');
    
    var collaborators = [];
    for (let index = 0; index < collaboratorIds.length; index++) {
      const id = collaboratorIds[index];
      const role = roles[index];
      const collaborator = { 'collaboratorId': id, 'role': role };
      collaborators.push(collaborator);
    }
    project.collaborators = collaborators;

    var process = {};
    process.name = "Project initiation";
    process.description = "Mandate For the Project"
    process.startDate = project.startDate;
    process.endDate = null; //FIXME: set an endDate to project initiation stage
    process.isActive = true;
    process.docs = [];
    project.processes = [];
    project.processes.push(process);

    await project.save();

    var id = project._id.toString();

    const path = Helpers.publicPath(id);
    const file = request.file("mandate");
    await file.move(path);
    if (!file.moved()) {
      return file.error();
    }
    return true;
  }


  /**
 * PUT: /projects/:id
 * Updates a project
 */
  update() {
  }

  /**
 * DELETE: /projects
 * Deletes a project
 */
  destroy() {
  }
}

module.exports = ProjectController;


