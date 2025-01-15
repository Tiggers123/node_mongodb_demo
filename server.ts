const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.send({ message: "Connected to the database" });
  } catch (error) {
    res.status(500).send({ error: "Cannot connect to database" });
  }
});

app.post("/customer/create", async (req, res) => {
  try {
    const payload = req.body;
    const customer = await prisma.customer.create({
      data: payload,
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/customer/list", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/customer/update/:id", async (req, res) => {
  try {
    const id = req.params.id; //ดึงค่า id จาก url
    const payload = req.body;
    const customer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: payload,
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/customer/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/customer/startsWith", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          startsWith: keyword,
        },
      },
    });
    res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/customer/endsWith", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          endsWith: keyword,
        },
      },
    });
    res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// contains
app.get('/customer/contains', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword  // LIKE '%keyword%'
                }
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/findCreditIsNotZero', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        credit: {
          not: 0,
        },
      },
    });
    res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  });

  app.get('/customer/sortByName', async (req, res) => {
    try{
      const customers = await prisma.customer.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      res.json(customers);
      } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  });

app.get("/customer/whereAnd", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        AND: [{ name: { contains: "z" } }, { credit: { gt: 0 } }], //gt > 0
      },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/customer/listBetweenCredit', async(req, res) => {
  try{
    const customers = await prisma.findMany({
      where: {
        credit: {
          gte: 1000, //gt > 1000
          lt: 200000, //lt < 20000
        }
      }
    });
    res.json(customers);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

 app.get('/customer/sumCredit', async (req, res) => {
  try {
    const sumCredit = await prisma.customer.aggregate({
      _sum: {
        credit: true,
      }
    });
    res.json(sumCredit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
 });

 app.get('/customer/maxCredit', async (req, res) => {
  try {
    const maxCredit = await prisma.customer.aggregate({
      _max: {
        credit: true,
      }
    });
    res.json({maxCredit: maxCredit._max.credit});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
 }
);

app.get("/customer/minCredit", async (req, res) => {
  try {
    const minCredit = await prisma.customer.aggregate({
      _min: {
        credit: true,
      },
    });
    res.json({ minCredit: minCredit._min.credit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/customer/avgCredit", async (req, res) => {
  try {
    const avgCredit = await prisma.customer.aggregate({
      _avg: {
        credit: true,
      },
    });
    res.json({ avgCredit: avgCredit._avg.credit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});