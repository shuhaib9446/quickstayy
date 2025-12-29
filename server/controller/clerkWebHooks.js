import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔥 CLERK WEBHOOK HIT 🔥");

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ VERIFY USING RAW BODY
    const evt = wh.verify(req.body, headers);

    const { type, data } = evt;
    console.log("Webhook type:", type);

    const userData = {
      _id: data.id, // must be String in schema
      email: data.email_addresses?.[0]?.email_address,
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      image: data.image_url,
    };

    if (type === "user.created") {
      await User.findByIdAndUpdate(
        data.id,
        userData,
        { upsert: true, new: true } // 🔥 prevents duplicate errors
      );

      console.log("USER SAVED", data.id);
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(" CLERK WEBHOOK ERROR:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

export default clerkWebhooks;
