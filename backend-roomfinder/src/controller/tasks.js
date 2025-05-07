export class TasksController {
    constructor({ tasksModel }) {
        this.tasksModel = tasksModel;
    }

    setLeasesStatus = async (req, res, next) => {
        try {
            const result = await this.tasksModel.setLeasesStatus();
            return res.json({ result });
        } catch (err) {
            next(err);
        }
    };
}