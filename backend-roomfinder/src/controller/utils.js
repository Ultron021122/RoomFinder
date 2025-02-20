import { PostalCodeService } from "../server/postalCode.js";

export class UtilsController {
    constructor() {
        this.PostalCodeService = new PostalCodeService();
    }

    getData = async (req, res, next) => {
        const { query } = req.params
        await this.PostalCodeService.getPostalCodeInfo({ query })
            .then(address => {
                if (address === false) return res.status(400).json({ message: 'Address not found.' })
                if (!address) return res.status(503).json({ message: 'Ocurrio un error.' })
                return res.json(address)
            })
            .catch(next);
    }
}