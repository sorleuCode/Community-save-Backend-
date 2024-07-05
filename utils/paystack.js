const axios = require("axios");
const https = require("https");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

const axiosInstance = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: ` Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const initializePayment = (email, amount) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email: email,
      amount: amount * 100,
      callback_url: "http://localhost:3500/verify",
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: ` Bearer ${PAYSTACK_SECRET_KEY}`, // where you place your secret key copied from your dashboard
        "Content-Type": "application/json",
      },
    };

    const clientReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    clientReq.on("error", (error) => {
      reject(error);
    });

    clientReq.write(params);
    clientReq.end();
  });
};

const verifyPayment = (reference) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: ` /transaction/verify / ${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    };

    const clientReq = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    clientReq.on("error", (error) => {
      reject(error);
    });

    clientReq.end();
  });
};

// const initialize = async (email, amount) => {
//     try {
//         const response = await axios.post(
//             '/transaction/initialize',
//             {
//                 email,
//                 amount: amount * 100, // Amount in kobo

//             },

//         );
//         return response.data.data;
//     } catch (error) {
//         console.error('Error initializing payment:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// const createCustomer =  (email, firstname, surname) => {

//         const params = JSON.stringify({
//             "email": email,
//             "first_name": firstname,
//             "last_name": surname,
//         })

//         const options = {
//             hostname: 'api.paystack.co',
//             port: 443,
//             path: '/customer',
//             method: 'POST',
//             headers: {
//                 Authorization: Bearer ${PAYSTACK_SECRET_KEY},
//                 'Content-Type': 'application/json'
//             }
//         }

//         const req = https.request(options, res => {
//             let data = ''

//             res.on('data', (chunk) => {
//                 data += chunk
//             });

//             res.on('end', () => {
//                 console.log(JSON.parse(data))

//             })

//         }).on('error', error => {
//             console.error(error)
//         })

//         req.write(params)
//         req.end()

// }

const createCustomer = async (email, firstName, lastName) => {
  try {
    const response = await axiosInstance.post("/customer", {
      email,
      first_name: firstName,
      last_name: lastName,
    });
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};

const createSubscription = async (customerId, planId) => {
  const params = JSON.stringify({
    customer: customerId,
    plan: planId,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/subscription",
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const req = https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("[res Data]", JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error("[Create Subscription Error]", error);
    });

  req.write(params);
  req.end();
};

// const createSubscription = async (customerId, planId) => {
//     try {
//         const response = await axiosInstance.post('/subscription', {
//             customer: customerId,
//             plan: planId,
//         });
//         return response.data.data.id;
//     } catch (error) {
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//             console.error('Error response status:', error.response.status);
//             console.error('Error response headers:', error.response.headers);
//         } else if (error.request) {
//             console.error('Error request:', error.request);
//         } else {
//             console.error('Error message:', error.message);
//         }
//         throw error;
//     }
// };

const createTransferRecipient = async (name, accountNumber, bankCode) => {
  const params = JSON.stringify({
    type: "nuban",
    name: name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transferrecipient",
    method: "POST",
    headers: {
      Authorization: PAYSTACK_SECRET_KEY,
      "Content-Type": "application/json",
    },
  };

  const req = https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  req.write(params);
  req.end();
};

// const createTransferRecipient = async (name, accountNumber, bankCode) => {
//     try {
//         const response = await axiosInstance.post('/transferrecipient', {
//             type: 'nuban',
//             name: name,
//             account_number: accountNumber,
//             bank_code: bankCode,
//         });
//         return response.data.data.recipient_code;
//     } catch (error) {
//         throw error;
//     }
// };

const initiateTransfer = async () => {
  const params = JSON.stringify({
    source: "balance",
    reason: "Calm down",
    amount: 3794800,
    recipient: "RCP_gx2wn530m0i3w3m",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transfer",
    method: "POST",
    headers: {
      Authorization: PAYSTACK_SECRET_KEY,
      "Content-Type": "application/json",
    },
  };

  const req = https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  req.write(params);
  req.end();
};

// const initiateTransfer = async (recipientCode, amount) => {
//     try {
//         const response = await axiosInstance.post('/transfer', {
//             source: 'balance',
//             amount: amount * 100,  // Convert amount to kobo
//             recipient: recipientCode,
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

module.exports = {
  createCustomer,
  createSubscription,
  createTransferRecipient,
  initiateTransfer,
  initializePayment,
  verifyPayment,
};
