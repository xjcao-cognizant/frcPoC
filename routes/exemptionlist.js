const ExemptionDao = require("../models/exemptionDao");

class ExemptionList {
  /**
   * Handles the various APIs for displaying and managing exemptions
   * @param {ExemptionDao} exemptionDao
   */
  constructor(exemptionDao) {
    this.exemptionDao = exemptionDao;
  }
  async showExemptions(req, res) {
    console.log("Get all exmps.");

    const querySpec = {
      query: "SELECT * FROM c",
    };

    const items = await this.exemptionDao.find(querySpec);

    items.forEach((item) => {
      console.log(`${item.id} - ${item.regulatedBusiness.name}`);
    });

    res.render("index", {
      title: "Report your forest risk commodity due dilligence",
      exemptions: items,
    });
  }

  async getExemptions(req, res) {
    // console.log("Get exmp by id.");
    const { id } = req.params;
    const querySpec = {
      query: "select * from c where c.regulatedBusiness.id=@businessId",
      parameters: [
        {
          name: "@businessId",
          value: id,
        },
      ],
    };
   
    const items = await this.exemptionDao.find(querySpec);

    items.forEach((item) => {
      console.log(`${item.id} - ${item.regulatedBusiness.name}`);
    });

    res.render("index", {
      title: "Report your forest risk commodity due dilligence",
      exemptions: items,
    });
  }

  async getExemption(req, res) {
    // console.log("Get exmp by id.");
    const { id } = req.params;
    const querySpec = {
      query: "select * from c where c.id=@id",
      parameters: [
        {
          name: "@id",
          value: id,
        },
      ],
    };
   
    const items = await this.exemptionDao.find(querySpec);

    items.forEach((item) => {
      console.log(`${item.id} - ${item.regulatedBusiness.name}`);
    });

    res.render("overview", {
      title: "Overview",
      exemptions: items,
    });
  }

  async addExemption(req, res) {
    const item = req.body;

    await this.exemptionDao.addItem(item);
    res.redirect("/");
  }

  async updateExemption(req, res) {
    const updatedExemptions = Object.keys(req.body);
    const exemptions = [];

    updatedExemptions.forEach((exemption) => {
      exemptions.push(this.exemptionDao.updateItem(exemption));
    });

    await Promise.all(exemptions);

    res.redirect("/");
  }
}

module.exports = ExemptionList;
