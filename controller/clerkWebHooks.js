
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        // create a sviX instance with clerk webhook secret
        const WHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // getting headers
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        }

        // verifying headers
        await WHook.verify(JSON.stringify(req.body), headers)

        // getting data from req.body
        const { data, type } = req.body
        console.log(req.body)
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url
        }
        console.log("Webhook type:", type);
        console.log("Webhook data:", data);


        // switch cases for different events
        switch (type) {
            case 'user.created':
                await User.create(userData)
                break;

            case 'user.updated':
                await User.findByIdAndUpdate(data.id, userData)
                break;

            case 'user.deleted':
                await User.findByIdAndDelete(data.id)
                break;
            default:
                break;
        }
        res.json({ success: true, message: "webhook Recieved" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error message" })
    }
}

export default clerkWebhooks