// // middlewares/validateEmail.js
// export const validateEmail = (req, res, next) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     // ✅ Use a strong regex to validate email format
//     const emailRegex =
//       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // ✅ Extra Security: Block disposable/temporary emails
//     const disposableDomains = [
//       "tempmail.com", "10minutemail.com", "mailinator.com", "guerrillamail.com"
//     ];
//     const domain = email.split("@")[1].toLowerCase();
//     if (disposableDomains.includes(domain)) {
//       return res.status(400).json({ error: "Disposable emails are not allowed" });
//     }

//     // ✅ Passed all checks
//     next();
//   } catch (error) {
//     return res.status(500).json({ error: "Email validation failed" });
//   }
// };


// middlewares/validateEmail.js
const dns = require("dns");

const validateEmail = (req, res, next) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ Normalize
    email = email.trim().toLowerCase();

    // ✅ Regex check
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Block disposable domains
    const disposableDomains = [
      "tempmail.com",
      "10minutemail.com",
      "mailinator.com",
      "guerrillamail.com",
    ];
    const domain = email.split("@")[1];
    if (disposableDomains.includes(domain)) {
      return res.status(400).json({ error: "Disposable emails are not allowed" });
    }

    // ✅ DNS MX check
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid Domain, cannot receive mail" });
      }
      // ✅ Passed all checks
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Email validation failed" });
  }
};

module.exports = {validateEmail};
