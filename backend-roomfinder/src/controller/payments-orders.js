import { validatePaymentOrder, validatePartialPaymentOrder} from "../schemas/payments-orders.js";

export class PaymentOrderController {
    constructor({ paymentOrderModel }) {
        this.paymentOrderModel = paymentOrderModel;
    }

    getAll = async (req, res, next) => {
        try {
            const orders = await this.paymentOrderModel.getAll();
            return res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req, res, next) => {
        const { id } = req.params;
        await this.paymentOrderModel
            .getById({ id })
            .then((order) => {
                if (order) return res.json(order);
                return res.status(404).json({ message: "Order not found" });
            })
            .catch(next);
    };

    getByLeases = async (req, res, next) => {
        const { id } = req.params;
        await this.paymentOrderModel
            .getByLeases({ leasesid: id })
            .then((orders) => {
                if (orders) return res.json(orders);
                return res.status(404).json({ message: "Orders not found" });
            })
            .catch(next);
    };

    getByLeasorId = async (req, res, next) => {
        const { id } = req.params;
        await this.paymentOrderModel
            .getByLeasorId({ leasorid: id })
            .then((orders) => {
                if (orders) return res.json(orders);
                return res.status(404).json({ message: "Orders not found" });
            })
            .catch(next);
    };

    getByStudentId = async (req, res, next) => {
        const { id } = req.params;
        await this.paymentOrderModel
            .getByStudentId({ studentid: id })
            .then((orders) => {
                if (orders) return res.json(orders);
                return res.status(404).json({ message: "Orders not found" });
            })
            .catch(next);
    };


    create = async (req, res, next) => {
        const result = validatePaymentOrder(req.body);
        if (result.error) {
            return res.status(404).json({ error: JSON.parse(result.error.message) });
        }

        try {
            const newOrder = await this.paymentOrderModel.create({ input: result.data });
            if (newOrder === false) return res.status(409).json({ message: "Order already exists" });
            return res.status(201).json(newOrder);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        const { id } = req.params;
        await this.paymentOrderModel
            .delete({ id })
            .then((result) => {
                if (result === false) return res.status(404).json({ message: "Order not found" });
                return res.json({ message: "Order deleted" });
            })
            .catch(next);
    };

    deleteByOrderId = async (req, res, next) => {
        const { orderid } = req.params;
        await this.paymentOrderModel
            .deleteByOrderId({ orderid })
            .then((result) => {
                if (result === false) return res.status(404).json({ message: "Order not found" });
                return res.json({ message: "Order deleted" });
            })
            .catch(next);
    };

    update = async (req, res, next) => {
        const { id } = req.params;
        const result = validatePartialPaymentOrder(req.body);
        if (result.error) {
            return res.status(404).json({ error: JSON.parse(result.error.message) });
        }

        try {
            const updatedOrder = await this.paymentOrderModel.update({ id, input: result.data });
            if (updatedOrder === false) return res.status(404).json({ message: "Order not found" });
            return res.json(updatedOrder);
        } catch (err) {
            next(err);
        }
    };

    getByStatus = async (req, res, next) => {
        const { status } = req.params;
        await this.paymentOrderModel
            .getByStatus({ status })
            .then((orders) => {
                if (orders) return res.json(orders);
                return res.status(404).json({ message: "Orders not found" });
            })
            .catch(next);
    };

    getByStatusAndLeases = async (req, res, next) => {
        const { status, leasesid } = req.params;
        await this.paymentOrderModel
            .getByStatusAndLeases({ status, leasesid })
            .then((orders) => {
                if (orders) return res.json(orders);
                return res.status(404).json({ message: "Orders not found" });
            })
            .catch(next);
    };

}