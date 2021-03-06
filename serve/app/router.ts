import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/login', controller.user.login);
  router.post('/api/scope', controller.user.scope);

  router.post('/api/position/task/:search?', controller.position.getTeachingTask);
  router.post('/api/position/:type/list', controller.position.list);
  router.post('/api/position/:type/detail/:id', controller.position.detail);
  router.post('/api/position/:type/form/:id?', controller.position.form);
  router.post('/api/position/:type/create', controller.position.create);
  router.post('/api/position/:type/delete/:id', controller.position.delete);
  router.post('/api/position/:type/audit/:id', controller.position.audit);
  router.post('/api/position/:type/batch-audit', controller.position.batchAudit);
  router.post('/api/position/:type/edit/:id', controller.position.edit);

  router.post('/api/stuapply/workload/list', controller.workload.list);
  router.post('/api/stuapply/workload/create', controller.workload.create);
  router.post('/api/stuapply/workload/edit', controller.workload.edit);
  router.post('/api/stuapply/workload/audit', controller.workload.audit);
  router.post('/api/stuapply/workload/export', controller.workload.export);

  router.post('/api/stuapply/:type/list', controller.stuapply.list);
  router.post('/api/stuapply/:type/form/:id', controller.stuapply.form);
  router.post('/api/stuapply/:type/create/:id', controller.stuapply.create);
  router.post('/api/stuapply/:type/delete/:id', controller.stuapply.delete);
  router.post('/api/stuapply/:type/audit/:id', controller.stuapply.audit);
  router.post('/api/stuapply/:type/edit/:id', controller.stuapply.edit);
  router.post('/api/stuapply/:type/file/:id?', controller.stuapply.file);

  router.post('/api/admin/client/:type/list/:search?', controller.admin.clientList);
  router.post('/api/admin/client/:type/create', controller.admin.clientCreate);
  router.post('/api/admin/client/:type/delete/:id', controller.admin.clientDelete);
  router.post('/api/admin/client/:type/edit/:id', controller.admin.clientEdit);
  router.post('/api/admin/time/:action', controller.admin.timeConfig);
  router.post('/api/admin/depadmin/list', controller.admin.depAdminList);
  router.post('/api/admin/depadmin/create', controller.admin.depAdminCreate);
  router.post('/api/admin/depadmin/delete/:id', controller.admin.depAdminDelete);
};
