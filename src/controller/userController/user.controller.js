import User from "../../model/user.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from "exceljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get all users data
export const getAllUserProfile = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ msg: "this is users data", users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

// pdf download pdf
export const getPdfUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId });
    const doc = new PDFDocument();

    // Pipe the document to a file
    doc.pipe(fs.createWriteStream(`userPdf/${user.firstName}.pdf`));

    // Add some content to the document
    doc.fontSize(25).text("user.firstName user.lastName", { align: "center" });

    // Read the image file from the assets folder
    const image = fs.readFileSync(
      path.join(__dirname, "..", "..", "assets", "images", user.profilePicture)
    );

    // Add an image of the user
    doc.image(image, {
      fit: [250, 300],
      align: "center",
      valign: "center",
    });

    // Add some text with user details
    doc.moveDown();
    doc
      .fontSize(20)
      .text(`Name: ${user.firstName}  ${user.lastName}`, { align: "left" });
    doc
      .fontSize(20)
      .text(`Date of Birth: ${user.dateOfBirth} `, { align: "left" });
    doc.fontSize(20).text(`Hobbies: ${user.hobbies}`, { align: "left" });
    doc.fontSize(20).text(`Projects: ${user.projects}`, { align: "left" });
    doc.fontSize(20).text(`Email: ${user.email}`, { align: "left" });
    doc.fontSize(20).text(`Phone: ${user.phone}`, { align: "left" });

    // Finalize the document and end the stream
    doc.end();

    // Send a success response
    res.send("PDF created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

//get user excel download
export const getExcelByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById({ _id: userId });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${user.firstName}`);

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Date of birth', key: 'dob', width: 10 },
        { header: 'Hobbies', key: 'hobbies', width: 30 },
        { header: 'Projects', key: 'projects', width: 30 },
      ];

        // Add data to the worksheet
  worksheet.addRow({
    name: user.firstName+" "+ user.lastName,
    email: user.email,
    dob: user.age,
    hobbies: user.hobbies.join(", "),
    projects: user.projects.join(", "),
  });

    // Set the content type and attachment header
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${user._id}.xlsx`);
  
    // Save the workbook to a file
    const filePath = path.join(__dirname, "..", "..", "userExcel",  `${user._id}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
  
    // Stream the file to the client
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
    
  }
};
