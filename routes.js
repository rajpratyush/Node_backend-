const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// const project_model = require('./Project');
// const subproject_model = require('./Subproject');
// const task_model = require('./Task');
// const subtask_model = require('./Subtask');
// const role_model = require('./roles')
// const agency_model = require('./agency')

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 151, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Try again later."
});

// router.get('/get-projects', (req, res) => {
//    console.log("api execution in progress");
//    project_model.getProjects()
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })

// router.post('/create-project', (req, res) => {
//    project_model.createProject(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })

// router.delete('/delete-project', (req, res) => {
//    // console.log("Hit!!")
//    // console.log(req.params)
//    project_model.deleteProject(req.query.id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          console.log(error)
//          res.status(500).send(error);
//       })
// })
// router.get('/get-subprojects', (req, res) => {
//    subproject_model.getSubprojects(req.query.project_id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.post('/create-subproject', (req, res) => {
//    subproject_model.createSubproject(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.delete('/delete-subproject', (req, res) => {
//    subproject_model.deleteSubproject(req.query.id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.get('/get-tasks', (req, res) => {
//    task_model.getTasks(req.query.subproject_id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.post('/create-task', (req, res) => {
//    task_model.createTask(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.delete('/delete-task', (req, res) => {
//    task_model.deleteTask(req.query.id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.get('/get-subtasks', (req, res) => {
//    subtask_model.getSubtasks(req.query.task_id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.post('/create-subtask', (req, res) => {
//    subtask_model.createSubtask(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.delete('/delete-subtask', (req, res) => {
//    subtask_model.deleteSubtask(req.query.id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.get('/get-roles', (req, res) => {
//    role_model.getRoles(req.query.project_id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.post('/create-role', (req, res) => {
//    role_model.createRole(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.put('/edit-role', (req, res) => {
//    role_model.editRole(req.body)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.delete('/delete-role', (req, res) => {
//   console.log("hit role delete route")
//    role_model.deleteRole(req.query.id)
//       .then(response => {
//          res.status(200).send(response);
//       })
//       .catch(error => {
//          res.status(500).send(error);
//       })
// })
// router.get('/get-agencies', (req, res) => {
//   agency_model.getAgencies()
//      .then(response => {
//         res.status(200).send(response);
//      })
//      .catch(error => {
//         res.status(500).send(error);
//      })
// })
// router.post('/create-agency', (req, res) => {
//   agency_model.createAgency(req.body)
//      .then(response => {
//         res.status(200).send(response);
//      })
//      .catch(error => {
//         res.status(500).send(error);
//      })
// })
// router.delete('/delete-agency', (req, res) => {
//   agency_model.deleteAgency(req.query.id)
//      .then(response => {
//         res.status(200).send(response);
//      })
//      .catch(error => {
//         res.status(500).send(error);
//      })
// })
// router.post('/signup', async (req, res) => {
//     try {
//         const { username: userName, email: userEmail, phone: phoneNumber, password , selectedState: state, selectedAgency: agency } = req.body;

//         // // Fetch state_id based on state_name from states table
//         // const stateResult = await pool.query('SELECT state_id FROM states1 WHERE state_name = $1;', [state_name]);
//         // if (stateResult.rows.length === 0) {
//         //     return res.status(400).json({ message: "State not found!" });
//         // }
//         // const state_id = stateResult.rows[0].state_id;

//         const existingUser = await pool.query('SELECT * FROM users1 WHERE user_email = $1;', [userEmail]);
//         if (existingUser.rows.length > 0) {
//             return res.status(400).json({ message: "User already exists!" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const userId = uuidv4();
//         const phone_number  = String(phoneNumber);

//         // Modify the INSERT statement to store state_name and state_id
//         await pool.query('INSERT INTO users1 (user_id, user_name, user_email, phone_number, password, role_access, state_name, agency_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);' ,
//             [userId, userName, userEmail, phone_number, hashedPassword, 'user', state, agency]);
        
//         return res.status(201).json({ message: "Signup successful!" });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.post('/login', loginLimiter, async (req, res) => {
//     try {
//         const { useremail: email, password } = req.body;
//         // console.log(req.body);

//         const user = await pool.query(
//           'SELECT users1.user_id, users1.user_name, users1.password, users1.role_access, states.state_name, agencies.agency_name FROM users1 INNER JOIN states ON users1.state_id = states.state_id INNER JOIN agencies ON users1.agency_id = agencies.agency_id WHERE users1.user_email = $1;', 
//           [email]);

//         const user1 = await pool.query(
//           'UPDATE users1 SET logged_in = $1 WHERE user_email = $2;', 
//           [1, email]); 

//         console.log(user.rows[0]);
//         if (user.rows.length === 0) {
//             return res.status(404).json({ message: "User not found!" });
//         }

//         if (await bcrypt.compare(password, user.rows[0].password)) {
//             if (user.rows[0].role_access ==='admin'){
//               res.status(200).json({ message: "Admin Logged in successfully!", user_name: user.rows[0].user_name, state: user.rows[0].state_name, agency: user.rows[0].agency_name });
//             }
//             else{
//             res.status(200).json({ message: "User Logged in successfully!", user_name: user.rows[0].user_name, state: user.rows[0].state_name, agency: user.rows[0].agency_name });
//           }
//         } else {
//             res.status(403).json({ message: "Incorrect password!" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/logout', loginLimiter, async (req, res) => {
//     try {
//         const user = await pool.query(
//           'Select user_email from users1 where logged_in =$1;', 
//           [1]);
//         const user1 = await pool.query(
//           'UPDATE users1 SET logged_in =$1 WHERE user_email = $2;', 
//           [0, user.rows[0].user_email]);
//         console.log(user.rows[0]);
//         res.status(200).json({ message: "Logged out successfully!"});
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/searchEmail', async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log(email);
//     const emailQuery = `SELECT * FROM users1 WHERE user_email = '${email}';`;
//     console.log("Generated Query for searchEmail:", emailQuery);
//     const result = await pool.query('SELECT * FROM users1 WHERE user_email = $1;', [email]);
//     if (result.rows.length > 0) {
//             console.log(res);
//       return res.status(200).json({ message: 'User exists!' });
//     } else {
//             console.log(res);
//       return res.status(404).json({ message: 'User not found!' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//           console.log(res);
//   }
// });



// router.post('/resetPassword', async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;
//     console.log(email, newPassword);
//     const hashedPassword = bcrypt.hashSync(newPassword, 10);
//     const passwordUpdateQuery = `UPDATE users1 SET password = '${hashedPassword}' WHERE user_email = '${email}';`;
//     console.log("Generated Query for resetPassword:", passwordUpdateQuery);
//     const result = await pool.query('UPDATE users1 SET password = $1 WHERE user_email = $2;', [hashedPassword, email]);
//     if (result.rows.length > 0) {
//       console.log(res);
//       return res.status(200).json({ message: 'Password reset successfully!' });
//     } else {
//             console.log(res);
//       return res.status(404).json({ message: 'User not found!' });
//     }
//   } catch (error) {

//     res.status(500).json({ error: error.message });
//           console.log(res);
//   }
// });



// router.get('/table1', async (req, res) => {
//   try {
//     const selectedDate = req.query.selectedDate;
//     let query = 'SELECT * FROM table_data1';
//     console.log(query);
//     console.log(selectedDate);
//     if (selectedDate) {
//       const integerTimestamp = selectedDate;
//       const date1 = new Date(integerTimestamp);
//       query += ` WHERE new_date = $1`; 
//       const data = await pool.query(query, [date1.toLocaleDateString('en-CA')]); 
//       console.log(data);// Using pool.query
//       const divisionQuery = 'SELECT division_name, total_meter FROM divisions';
//       const divisionData = await pool.query(divisionQuery); // Using pool.query

//       const updatedData = data.rows.map((item) => {
//         const division = divisionData.rows.find((d) => d.division_name === item.division);
//         if (division) {
//           item.meters_to_be_installed = division.total_meter;
//         }
//         return item;
//       });
//       console.log(updatedData);
//       res.json(updatedData);
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//     console.log(error);

//   }
// });


// // Route to get data for the second table
// router.get('/table2', async (req, res) => {
//   try {
//     const selectedDate = req.query.selectedDate;
//     let query = 'SELECT * FROM table_data';
//     console.log(query);
//     console.log(selectedDate);
//     if (selectedDate) {
//       const integerTimestamp = selectedDate;
//       const date1 = new Date(integerTimestamp);
//       query += ` WHERE new_date = $1`;
//       const data = await pool.query(query, [date1.toLocaleDateString('en-CA')]);
//       console.log(data);
//       const divisionQuery = 'SELECT division_name, total_meter FROM divisions';
//       const divisionData = await pool.query(divisionQuery);

//       const updatedData = data.rows.map((item) => {
//         const division = divisionData.rows.find((d) => d.division_name === item.division);
//         if (division) {
//           item.meters_to_be_installed = division.total_meter;
//         }
//         return item;
//       });
//       console.log(updatedData);
//       res.json(updatedData);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // Route to get data for Report 1
// router.get('/report1', async (req, res) => {
//   try {
//     let query = `
//       SELECT 
//         md.installationdate, 
//         a.areaname AS area, 
//         md.status, 
//         wd.workordernumber AS workorder_no, 
//         wd.workordertype AS workorder_type, 
//         miad.approvaltype AS approval_type, 
//         bad.approvalstatus AS billing_approval_status
//       FROM 
//         meterdetails md
//         JOIN area a ON md.areaid = a.areaid
//         JOIN workorderdetails wd ON md.meterid = wd.meterid
//         JOIN meterinstallationapprovaldetails miad ON md.meterid = miad.meterid
//         JOIN billingapprovaldetails bad ON md.meterid = bad.meterid
//     `;
//     const data = await pool.query(query);
//     res.json(data.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // Route to get data for Report 2 with Serial Number
// router.get('/report2', async (req, res) => {
//   try {
//     let query = `
//       SELECT 
//         a.areaname AS area, 
//         m.installationdate, 
//         m.submissiondate, 
//         m.dismantlingdate, 
//         m.status,
//         m.submitted_at,
//         m.serialnumber
//       FROM 
//         meter m
//         JOIN area a ON m.areaid = a.areaid
//     `;
//     const data = await pool.query(query);
//     res.json(data.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // API to fetch all states
// router.get('/fetch_states', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM states;');
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // API to add a new state
// router.post('/insert_states', async (req, res) => {
//   try {
//     const { stateName } = req.body;
//     const stateId = uuidv4();
//     await pool.query('INSERT INTO states (state_id, state_name) VALUES ($1, $2);', [stateId, stateName]);
//     res.status(201).json({ message: "State added successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



// // Add this somewhere in your routes.js file
// router.get('/fetch_projects', async (req, res) => {
//     try {
//         const state_id = req.query.state; // using query parameter
//         // const result = await pool.query('SELECT state_id FROM public.states WHERE state_name = $1', [state]);
//         // const state_id = result.rows[0].state_id;
//         const projectResult = await pool.query('SELECT project_name FROM public.projects WHERE state_id = $1', [state_id]);
//         res.status(200).json(projectResult.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.post('/insert_projects', async (req, res) => {
//     try {
//         const { projectName, startDate, endDate, state } = req.body;
//         const result = await pool.query('SELECT state_id FROM public.states WHERE state_name = $1', [state]);
//         const stateId = result.rows[0].state_id;
//         const projectId = uuidv4();
//         await pool.query('INSERT INTO projects (project_id, project_name, start_date, end_date, state_id) VALUES ($1, $2, $3, $4, $5)',
//           [projectId, projectName, startDate, endDate, stateId]);
//         res.status(201).json({ message: "Project added successfully!" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Add this somewhere in your routes.js file
// router.get('/fetch_zones', async (req, res) => {
//     try {
//         const project = req.query.projects1; // using query parameter
//         // console.log('a', project);
//         const result = await pool.query('SELECT project_id FROM public.projects WHERE project_name = $1', [project]);
//         const project_id = result.rows[0].project_id;
//         // console.log('b',project_id);
//         const zoneResult = await pool.query('SELECT * FROM public.zones WHERE project_id = $1', [project_id]);
//        console.log('c',zoneResult);
//         res.status(200).json(zoneResult.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.post('/insert_zones', async (req, res) => {
//     try {
//         const { zoneName,
//             total1PhaseMeters,
//             total3PhaseMeters,
//             totalDtMeters,
//             totalFeederMeters, projects1 } = req.body;
//             console.log(req.body);
//             console.log( zoneName,
//             total1PhaseMeters,
//             total3PhaseMeters,
//             totalDtMeters,
//             totalFeederMeters, projects1);
//         const result = await pool.query('SELECT state_id, project_id FROM public.projects WHERE project_name = $1', [projects1]);
//         console.log(result.rows[0]);
//         const stateId = result.rows[0].state_id;
//         const project_id = result.rows[0].project_id;
//         const zoneId = uuidv4();
//         const total3PhaseMetersNum = parseInt(total3PhaseMeters, 10);
//         const total1PhaseMetersNum = parseInt(total1PhaseMeters, 10);
//         const totalDtMetersNum = parseInt(totalDtMeters, 10);
//         const totalFeederMetersNum = parseInt(totalFeederMeters, 10);
//         const total_consumer_meter = total3PhaseMetersNum + total1PhaseMetersNum;
//         const total_system_meter = totalDtMetersNum + totalFeederMetersNum;
//         const total_meter = total_consumer_meter + total_system_meter;       
//         console.log(zoneId, zoneName, project_id, total1PhaseMeters, total3PhaseMeters,total_consumer_meter, totalDtMeters, totalFeederMeters, total_system_meter, total_meter, stateId);
//         await pool.query(`
//             INSERT INTO zones (
//               zone_id, zone_name, project_id, 
//               "1phase_smart_meter", "3phase_smart_meter", total_consumer_meter,
//               "DT_smart_meter", feeder_smart_meter, total_system_meter, state_id) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//             [
//               zoneId, zoneName, project_id, total1PhaseMetersNum, total3PhaseMetersNum, 
//               total_consumer_meter, totalDtMetersNum, totalFeederMetersNum, 
//               total_system_meter, stateId
//             ]
//           ); 

//           res.status(201).json({ message: "Zone added successfully!" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Add this somewhere in your routes.js file
// router.get('/fetch_districts', async (req, res) => {
//     try {
//         console.log('Received query:', req.query);
//         const zone = req.query.zone; // using query parameter
//         console.log('d', zone);
//         const result = await pool.query('SELECT zone_id FROM public.zones WHERE zone_name = $1;', [zone]);
//         const zone_id = result.rows[0].zone_id;
//         console.log('e',zone_id);
//         const zoneResult = await pool.query('SELECT * FROM public.districts WHERE zone_id = $1;', [zone_id]);
//         console.log('f',zoneResult);
//         res.status(200).json(zoneResult.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.post('/insert_districts', async (req, res) => {
//     try {
//         const { districtName,
//             total1PhaseMeters,
//             total3PhaseMeters,
//             totalDtMeters,
//             totalFeederMeters, zone } = req.body;
//         const result = await pool.query('SELECT state_id, project_id, zone_id FROM public.zones WHERE zone_name = $1', [zone]);
//         const stateId = result.rows[0].state_id;
//         const zoneId = result.rows[0].zone_id;
//         const project_id = result.rows[0].project_id;
//         const districtId = uuidv4();
//         const total3PhaseMetersNum = parseInt(total3PhaseMeters, 10);
//         const total1PhaseMetersNum = parseInt(total1PhaseMeters, 10);
//         const totalDtMetersNum = parseInt(totalDtMeters, 10);
//         const totalFeederMetersNum = parseInt(totalFeederMeters, 10);
//         const total_consumer_meter = total3PhaseMetersNum + total1PhaseMetersNum;
//         const total_system_meter = totalDtMetersNum + totalFeederMetersNum;
//         const total_meter = total_consumer_meter + total_system_meter;
//        await pool.query(`
//         INSERT INTO districts (
//           district_id, 
//           district_name, 
//           project_id, 
//           "1phase_smart_meter", 
//           "3phase_smart_meter",
//           total_consumer_meter, 
//           "DT_smart_meter", 
//           feeder_smart_meter,
//           total_system_meter,
//           total_meter, 
//           state_id, 
//           zone_id
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
//         [
//           districtId, 
//           districtName, 
//           project_id, 
//           total1PhaseMetersNum, 
//           total3PhaseMetersNum,
//           total_consumer_meter, 
//           totalDtMetersNum, 
//           totalFeederMetersNum, 
//           total_system_meter, 
//           total_meter,
//           stateId, 
//           zoneId
//         ]
//       );
//       res.status(201).json({ message: "District added successfully!" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get('/fetch_divisions', async (req, res) => {
//     try {
//         console.log('Received1 query:', req.query);
//         const district = req.query.district; // using query parameter
//         console.log('d1', district);
//         const result = await pool.query('SELECT district_id FROM public.districts WHERE district_name = $1;', [district]);
//         const district_id = result.rows[0].district_id;
//         console.log('e1',district_id);
//         const zoneResult = await pool.query('SELECT division_name FROM public.divisions WHERE district_id = $1;', [district_id]);
//         console.log('f1',zoneResult);
//         res.status(200).json(zoneResult.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.get('/fetch_meter_installation', async (req, res) => {
//     try {
//         // Query to fetch meter installation details
//         const query = `
//             SELECT
//                 zone_name,
//                 meters_installed,
//                 total_meters,
//                 meters_remaining
//             FROM
//                 public.dashboard;
//         `;

//         const result = await pool.query(query);
        
//         // Transform the database result into the format expected by the frontend
//         const rawData = result.rows.map(row => ({
//             name: row.zone_name,
//             installed: row.meters_installed,
//             total: row.total_meters,
//             remaining: row.meters_remaining
//         }));
//         console.log("Data got :",rawData);

//         res.status(200).json(rawData);
//     } catch (error) {
//       console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get('/fetch_available_years', async (req, res) => {
//   try {
//     // Query to fetch distinct years from the meter_installation table
//     const query = `
//       SELECT DISTINCT CAST(EXTRACT(YEAR FROM "Date") AS INTEGER) AS year
//       FROM public.meters_installation
//       ORDER BY year;
//     `;

//     const result = await pool.query(query);
//     const years = result.rows.map(row => row.year);
//     console.log("year received",years);
//     res.status(200).json(years);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_available_years1', async (req, res) => {
//   try {
//     // Query to fetch distinct years from the meter_installation table
//     const query = `
//       SELECT DISTINCT CAST(EXTRACT(YEAR FROM milestone_date) AS INTEGER) AS year
//       FROM public.financial_data
//       ORDER BY year;
//     `;

//     const result = await pool.query(query);
//     const years = result.rows.map(row => row.year);
//     console.log("year received  here are as follows:",years);
//     res.status(200).json(years);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_vendors', async (req, res) => {
//   try {
//     // Query to fetch distinct years from the meter_installation table
//     const query = `
//       SELECT DISTINCT (vendor_name)  
//       FROM public.meters_installation;
//     `;

//     const result = await pool.query(query);
//     console.log("vendors received  here are as follows:",result);
//     res.status(200).json(result.rows); // Send back just the rows data

//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_available_months', async (req, res) => {
//   try {
//     const year = req.query.year; // Get the year from query parameters
//     if (!year) {
//       return res.status(400).json({ error: 'Year is required' });
//     }
//     console.log("year received from frontend", year);

//     // Query to fetch distinct months for a given year
//     const query = `
//       SELECT DISTINCT 
//         TO_CHAR(milestone_date, 'Month') AS month_name,
//         EXTRACT(MONTH FROM milestone_date) AS month_number
//       FROM public.financial_data
//       WHERE EXTRACT(YEAR FROM milestone_date) = $1
//       ORDER BY month_number;
//     `;

//     // Execute the query with the year parameter
//     const result = await pool.query(query, [year]);

//     // Map over the results to get an array of month names
//     const months = result.rows.map(row => row.month_name.trim());

//     console.log("Months received", months);

//     res.status(200).json(months);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });




// // Backend API to fetch available zones
// router.get('/fetch_available_zones', async (req, res) => {
//   try {
//     // Query to fetch distinct zones from the meters_installation table
//     const query = `
//       SELECT DISTINCT zone_name
//       FROM public.meters_installation;
//     `;

//     const result = await pool.query(query);
//     const zones = result.rows.map(row => row.zone_name);
//     console.log("zone:",zones);
//     res.status(200).json(zones);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_meter_installation_total', async (req, res) => {
//     try {
//         // Extract the "year" query parameter from the request as a string
//         const year = req.query.year;
//         console.log(" year:", year);

//         // Ensure year is parsed as an integer
//         const year1 = parseInt(year, 10);
//         console.log("year1: ",year1);

//         const meterType = req.query.meterType; // New query parameter for meter type
//         const vendorName = req.query.vendorName; // New query parameter for vendor name
//         console.log("type of meter",meterType);
//         console.log("vendor name", vendorName);

//         // Query to fetch total target installation and meter installation per month for the specified year
//         let query = `
//             SELECT
//                 EXTRACT(MONTH FROM "Date") AS month,`;                        // Add conditions based on meter type
//         if (meterType === 'all') {
//             query += `SUM(target_installation) AS total_target_installation,
//                 SUM(actual_installation) AS total_actual_installation`; // Example condition
//         }
//         else if (meterType === 'consumer') {
//             query += `SUM(target_consumer_meter) AS total_target_installation,
//                 SUM(actual_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'system') {
//             query += `SUM(target_system_meter) AS total_target_installation,
//                 SUM(actual_system_meter) AS total_actual_installation`;

//         }
//         else if (meterType === '1phase') {
//             query += `SUM(target_1_phase_consumer_meter) AS total_target_installation,
//                 SUM(actual_1_phase_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === '3phase') {
//             query += `SUM(target_3_phase_consumer_meter) AS total_target_installation,
//                 SUM(actual_3_phase_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'ltct') {
//             query += `SUM(target_ltct_meter) AS total_target_installation,
//                 SUM(actual_ltct_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'feeder') {
//             query += `SUM(target_feeder_meter) AS total_target_installation,
//                 SUM(actual_feeder_meter) AS total_actual_installation`;

//         }
//         query+=
//             ` FROM
//                 public.meters_installation
//             WHERE
//                 EXTRACT(YEAR FROM "Date") = ${year1}`; 
//         if (vendorName) {
//             query += ` AND vendor_name = '${vendorName}'`;
//         }

//         query+=

//             ` GROUP BY
//                 EXTRACT(MONTH FROM "Date")
//             ORDER BY
//                 month;
//                 `;

//         const result = await pool.query(query);


//         // Transform the database result into the format expected by the frontend
//         const rawData = result.rows.map(row => ({
//             month: row.month,
//             total_target_installation: row.total_target_installation,
//             total_actual_installation: row.total_actual_installation
//         }));
//         console.log(rawData);

//         res.status(200).json(rawData);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get('/fetch_meter_installation_total1', async (req, res) => {
//     try {
//         const year = parseInt(req.query.year, 10);
//         const zone = req.query.zone;
//         console.log("zone:",zone);
//         const meterType = req.query.meterType; // New query parameter for meter type
//         const vendorName = req.query.vendorName; // New query parameter for vendor name
//         console.log("type of meter",meterType);
//         console.log("vendor name", vendorName);

//         // Make sure the year is a number and the zone is a string
//         if (isNaN(year) || typeof zone !== 'string') {
//             return res.status(400).json({ error: 'Invalid query parameters' });
//         }

//         let query = `
//             SELECT
//                 EXTRACT(MONTH FROM "Date") AS month,`;                        // Add conditions based on meter type
//         if (meterType === 'all') {
//             query += `SUM(target_installation) AS total_target_installation,
//                 SUM(actual_installation) AS total_actual_installation`; // Example condition
//         }
//         else if (meterType === 'consumer') {
//             query += `SUM(target_consumer_meter) AS total_target_installation,
//                 SUM(actual_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'system') {
//             query += `SUM(target_system_meter) AS total_target_installation,
//                 SUM(actual_system_meter) AS total_actual_installation`;

//         }
//         else if (meterType === '1phase') {
//             query += `SUM(target_1_phase_consumer_meter) AS total_target_installation,
//                 SUM(actual_1_phase_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === '3phase') {
//             query += `SUM(target_3_phase_consumer_meter) AS total_target_installation,
//                 SUM(actual_3_phase_consumer_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'ltct') {
//             query += `SUM(target_ltct_meter) AS total_target_installation,
//                 SUM(actual_ltct_meter) AS total_actual_installation`;

//         }
//         else if (meterType === 'feeder') {
//             query += `SUM(target_feeder_meter) AS total_target_installation,
//                 SUM(actual_feeder_meter) AS total_actual_installation`;

//         }
//         query+=
//             ` FROM
//                 public.meters_installation
//             WHERE
//                 EXTRACT(YEAR FROM "Date") = ${year}`; 
        
//         if (zone) {
//             query += ` AND zone_name = '${zone}'`;
//         }        
//         if (vendorName) {
//             query += ` AND vendor_name = '${vendorName}'`;
//         }

//         query+=

//             ` GROUP BY
//                 EXTRACT(MONTH FROM "Date")
//             ORDER BY
//                 month;
//                 `;
//         console.log("query:" ,query);
//         const result = await pool.query(query);


//         const rawData = result.rows.map(row => ({
//             month: row.month,
//             total_target_installation: row.total_target_installation,
//             total_meter_installation: row.total_actual_installation
//         }));

//         res.status(200).json(rawData);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });


// function excelDateToJSDate(serial) {
//   const millisecondsPerDay = 86400000;
//   const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // December 30, 1899
//   const trueSerial = serial - 1; // Excel thinks 1900 is a leap year, but it's not. So we subtract 1.
//   const date = new Date(excelEpoch.getTime() + trueSerial * millisecondsPerDay);
  
//   // Set the hours, minutes, and seconds to 0 to avoid any potential time zone issues
//   date.setUTCHours(0, 0, 0, 0);

//   return date;
// }

// function interchangeMonthAndDay(originalDate) {
//   if (!(originalDate instanceof Date)) {
//     throw new Error('The provided input is not a Date object');
//   }

//   // Convert the date to a string in 'YYYY-MM-DD' format
//   const dateString = originalDate.toISOString().split('T')[0];

//   // Parse the year, month, and day parts of the date string
//   const year = dateString.slice(0, 4);
//   const month = dateString.slice(5, 7);
//   const day = dateString.slice(8, 10);

//   // Reconstruct the date string with month and day interchanged
//   const adjustedDateString = `${year}-${day}-${month}`;

//   // Convert the adjusted date string back to a JavaScript Date object
//   const adjustedDate = new Date(adjustedDateString);
  
//   return adjustedDate;
// }




// router.post('/upload_financial_data', async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("data is here", data)
//     // Validate the data (ensure it is an array, etc.)

//     const query = `
//       INSERT INTO public.financial_data (
//         meter_months,
//         payment_disbursed_in_current_month,
//         total_payment_to_be_made_in_next_month,
//         meters_remaining,
//         milestone_date,
//         total_payment_disbursed_till_date
//       ) VALUES ($1, $2, $3, $4, $5, $6)
//     `;

//     for (const row of data) {
//         const excelDate = excelDateToJSDate(row.milestone_date);
//         const adjustedDate = interchangeMonthAndDay(excelDate);

//       const values = [
//         row.meter_months,
//         row.payment_disbursed_in_current_month,
//         row.total_payment_to_be_made_in_next_month,
//         row.meters_remaining,
//         adjustedDate,
//         row.total_payment_disbursed_till_date,
//       ];
//       await pool.query(query, values);
//     }

//     res.json({ message: 'Data inserted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// router.post('/upload_meter_installation_data', async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("Meter Installation Data Received:", data)

//     const query = `
//       INSERT INTO public.meters_installation (
//         zone_name,
//         actual_installation,
//         target_installation,
//         "Date",
//         target_1_phase_consumer_meter,
//         actual_1_phase_consumer_meter,
//         target_3_phase_consumer_meter,
//         actual_3_phase_consumer_meter,
//         target_ltct_meter,
//         actual_ltct_meter,
//         target_feeder_meter,
//         actual_feeder_meter,
//         actual_consumer_meter,
//         target_consumer_meter,
//         actual_system_meter,
//         target_system_meter,
//         vendor_name
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
//     `;

//     for (const row of data) {
//       const excelDate = excelDateToJSDate(row.Date);
//       const adjustedDate = interchangeMonthAndDay(excelDate);
//       const values = [
//         row.zone_name,
//         row.actual_installation,
//         row.target_installation,
//         adjustedDate, // Make sure this is the date format your database expects
//         row.target_1_phase_consumer_meter,
//         row.actual_1_phase_consumer_meter,
//         row.target_3_phase_consumer_meter,
//         row.actual_3_phase_consumer_meter,
//         row.target_ltct_meter,
//         row.actual_ltct_meter,
//         row.target_feeder_meter,
//         row.actual_feeder_meter,
//         row.actual_consumer_meter,
//         row.target_consumer_meter,
//         row.actual_system_meter,
//         row.target_system_meter,
//         row.vendor_name
//       ];
//       await pool.query(query, values);
//     }

//     res.json({ message: 'Meter installation data inserted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// router.post('/upload_table_data', async (req, res) => {
//   try {
//     const data = req.body;

//     // Here you can add additional validation if needed
//         console.log("table_data Received:", data)

//     const query = `
//       INSERT INTO public.table_data (
//         division,
//         meters_to_be_installed,
//         meters_replaced,
//         total_meters_ported_to_billing_system,
//         total_meters_installed_for_new_connections,
//         total_new_connections_ported_to_billing_system,
//         total_meters_installed,
//         completion_percent,
//         remarks,
//         new_date
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//     `;

//     // Begin transaction
//     await pool.query('BEGIN');
//     for (const row of data) {
//       const values = [
//         row.division,
//         row.meters_to_be_installed,
//         row.meters_replaced,
//         row.total_meters_ported_to_billing_system,
//         row.total_meters_installed_for_new_connections,
//         row.total_new_connections_ported_to_billing_system,
//         row.total_meters_installed,
//         row.completion_percent,
//         row.remarks,
//         new Date(row.new_date) // Assuming date is in a standard format (ISO8601)
//       ];
//       await pool.query(query, values);
//     }
//     // Commit transaction
//     await pool.query('COMMIT');

//     res.json({ message: 'Data inserted successfully' });
//   } catch (error) {
//     // If error, rollback any changes made during the transaction
//     await pool.query('ROLLBACK');
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// router.post('/upload_meter_data', async (req, res) => {
//   try {
//     const data = req.body;
//     // Additional data validation logic can be implemented here

//         // Here you can add additional validation if needed
//         console.log("table_data1 Received:", data)

//     const query = `
//       INSERT INTO public.table_data1 (
//         division,
//         meters_to_be_installed,
//         new_service_connection,
//         replacement_single_phase_working_actual,
//         replacement_single_phase_working_defective,
//         replacement_single_phase_defective_running_ok,
//         replacement_single_phase_defective_actual_defective,
//         replacement_three_phase_working_actual,
//         replacement_three_phase_working_defective,
//         replacement_three_phase_defective_running_ok,
//         replacement_three_phase_defective_actual_defective,
//         replacement_other_feeder_meter,
//         replacement_other_dt_meter,
//         completion_percent,
//         meters_remaining_to_be_installed,
//         remarks,
//         new_date
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
//     `;

//     // Begin transaction
//     await pool.query('BEGIN');
//     for (const row of data) {
//       const values = [
//         row.division,
//         row.meters_to_be_installed,
//         row.new_service_connection,
//         row.replacement_single_phase_working_actual,
//         row.replacement_single_phase_working_defective,
//         row.replacement_single_phase_defective_running_ok,
//         row.replacement_single_phase_defective_actual_defective,
//         row.replacement_three_phase_working_actual,
//         row.replacement_three_phase_working_defective,
//         row.replacement_three_phase_defective_running_ok,
//         row.replacement_three_phase_defective_actual_defective,
//         row.replacement_other_feeder_meter,
//         row.replacement_other_dt_meter,
//         row.completion_percent,
//         row.meters_remaining_to_be_installed,
//         row.remarks,
//         row.new_date ? new Date(row.new_date) : null // Handles null dates
//       ];
//       await pool.query(query, values);
//     }
//     // Commit transaction
//     await pool.query('COMMIT');

//     res.json({ message: 'Data inserted successfully' });
//   } catch (error) {
//     // Rollback any changes if there was an error during the transaction
//     await pool.query('ROLLBACK');
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// router.get('/fetch_dashboard_data', async (req, res) => {
//     try {
//         const year = parseInt(req.query.year, 10);
//         const monthName = req.query.month;
//         console.log("year in api", year);
//         console.log("month in api", monthName);

//         // Make sure the year is a number and the monthName is a string
//         if (isNaN(year) || typeof monthName !== 'string' || monthName.length === 0) {
//             return res.status(400).json({ error: 'Invalid query parameters' });
//         }

//         const query = `
//                       SELECT
//                           meter_months,
//                           total_payment_disbursed_till_date AS total_payment_till_date,
//                           payment_disbursed_in_current_month,
//                           total_payment_to_be_made_in_next_month
//                       FROM
//                           public.financial_data
//                       WHERE
//                           EXTRACT(YEAR FROM milestone_date) = $1
//                           AND TRIM(TO_CHAR(milestone_date, 'Month')) = $2
//                       ORDER BY
//                           milestone_date;
//                       ;
//         `;

//         const values = [year, monthName];

//         const result = await pool.query(query, values);
//         console.log(result);

//         // If there are no rows, it means no data was found for the given month and year
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'No data found for the given month and year' });
//         }

//         // Since the query might return multiple rows, we send all of them
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });



// router.post('/insert_divisions', async (req, res) => {
//     try {
//         const { divisionName, district } = req.body;
//         const result = await pool.query('SELECT state_id, project_id, zone_id, district_id FROM public.districts WHERE district_name = $1', [district]);
//         const stateId = result.rows[0].state_id;
//         const zoneId = result.rows[0].zone_id;
//         const project_id = result.rows[0].project_id;
//         const districtId = result.rows[0].district_id;
//         const divisionId = uuidv4();
//        await pool.query('INSERT INTO divisions (division_id, division_name, project_id, district_id, state_id, zone_id) VALUES ($1, $2, $3, $4, $5, $6)',
//             [divisionId, divisionName, project_id, districtId,stateId, zoneId]);       
//           res.status(201).json({ message: "Division added successfully!" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get('/fetch_subdivisions', async (req, res) => {
//     try {
//         console.log('Received query2:', req.query);
//         const division = req.query.division; // using query parameter
//         console.log('d2', division);
//         const result = await pool.query('SELECT division_id FROM public.divisions WHERE division_name = $1;', [division]);
//         const division_id = result.rows[0].division_id;
//         console.log('e2',division_id);
//         const zoneResult = await pool.query('SELECT subdivision_name FROM public.subdivisions WHERE division_id = $1;', [division_id]);
//         console.log('f2',zoneResult);
//         res.status(200).json(zoneResult.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// router.post('/insert_subdivisions', async (req, res) => {
//     try {
//         const { subdivisionName, division } = req.body;
//         const result = await pool.query('SELECT state_id, project_id, zone_id, district_id, division_id FROM public.divisions WHERE division_name = $1', [division]);
//         const stateId = result.rows[0].state_id;
//         const zoneId = result.rows[0].zone_id;
//         const project_id = result.rows[0].project_id;
//         const districtId = result.rows[0].district_id;
//         const divisionId = result.rows[0].division_id;
//         const subdivisionId = uuidv4();
//        await pool.query('INSERT INTO subdivisions (subdivision_id, subdivision_name, project_id, district_id, division_id, state_id, zone_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//             [subdivisionId, subdivisionName, project_id, districtId, divisionId, stateId, zoneId]);       
//           res.status(201).json({ message: "Subdivision added successfully!" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }

// });

// //the following set of apis are specifically for a chart 

// router.get('/fetch_project', async (req, res) => {
//   try {
//     const user = await pool.query(
//       'Select state_id from users1 where logged_in =$1;', 
//       [1]);
//     const result = await pool.query('SELECT project_name FROM projects where state_id = $1;',[user.rows[0].state_id]);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_vendor', async (req, res) => {
//   try {
//     // Query to fetch distinct years from the meter_installation table
//     const query = `
//       SELECT DISTINCT (vendorname)  
//       FROM public.vendor;
//     `;

//     const result = await pool.query(query);
//     console.log("vendors received  here are as follows:",result);
//     res.status(200).json(result.rows); // Send back just the rows data

//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

 
// router.get('/fetch_years', async (req, res) => {
//   try {
//     // Query to fetch distinct years from the meter_installation table
//     const query = `
//             SELECT DISTINCT CAST(EXTRACT(YEAR FROM CAST("installationdate" AS DATE)) AS INTEGER) AS year
//             FROM public.cccmeterinstallation
//             ORDER BY year;
//     `;

//     const result = await pool.query(query);
//     console.log("query result", result);
//     console.log("result section", result);
//     const years = result.rows.map(row => row.year);
//     console.log("year received here ",years);
//     res.status(200).json(years);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_zone', async (req, res) => {
//   try {
//     const project = req.query.project;
//     // const user = await pool.query(
//     //   'Select state_id from users1 where logged_in =$1;', 
//     //   [1]);
//     const res1 = await pool.query('SELECT project_id FROM projects where project_name = $1;',[project]);
//     const result = await pool.query('SELECT zonename FROM zone where project_id = $1;',[res1.rows[0].project_id]);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_district', async (req, res) => {
//   try {
//     const zone = req.query.zone;
//     // const user = await pool.query(
//     //   'Select state_id from users1 where logged_in =$1;', 
//     //   [1]);
//     const res1 = await pool.query('SELECT zoneid FROM zone where zonename = $1;',[zone]);
//     const result = await pool.query('SELECT districtname FROM district where zoneid = $1;',[res1.rows[0].zoneid]);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_division', async (req, res) => {
//   try {
//     const district = req.query.district;
//     console.log("districtname", district);
//     // const user = await pool.query(
//     //   'Select state_id from users1 where logged_in =$1;', 
//     //   [1]);
//     const res1 = await pool.query(`SELECT districtid FROM district WHERE districtname = '${district}';`);

//     console.log("result from query 1", res1);
//     const result = await pool.query(`SELECT divisionoffice FROM division where districtid = ${res1.rows[0].districtid};`);
//     console.log("result from query 2", result);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_ccc', async (req, res) => {
//   try {
//     const division = req.query.division;
//     console.log("division name", division);
//     // const user = await pool.query(
//     //   'Select state_id from users1 where logged_in =$1;', 
//     //   [1]);
//     const res1 = await pool.query(`SELECT divisionid FROM division where divisionoffice = '${division}';`);
//         console.log("result from ccc query 1", res1);
//     const result = await pool.query(`SELECT cccname FROM ccc where divisionid = ${res1.rows[0].divisionid};`);
//        console.log("result from ccc query 2", result); 
    

//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.get('/fetch_ccc_meter_installation', async (req, res) => {
//     try {
//         const year = parseInt(req.query.selectedYear, 10);
//         const ccc1 = req.query.selectedCCC;
//         const zone1 = req.query.selectedZone;
//         const district1 = req.query.selectedDistrict;
//         const division1 = req.query.selectedDivision;
//         console.log(" ccc :",ccc1);
//         const meterType = req.query.meterType; // New query parameter for meter type
//         const vendor1 = req.query.selectedVendor; // New query parameter for vendor name
//         console.log("type of meter",meterType);
//         console.log("vendor name", vendor1);

//         // // Make sure the year is a number and the zone is a string
//         // if (isNaN(year) || typeof zone !== 'string') {
//         //     return res.status(400).json({ error: 'Invalid query parameters' });
//         // }

//         // let res1;
//         // let res2;
//         // let res3;
//         // let res4;
//         // let res5;

//         // if (vendor1) {
//         //     const query1 = `
//         //         SELECT DISTINCT (vendorid)  
//         //         FROM public.vendor WHERE vendorname = $1;
//         //     `;
//         //     console.log("query details", query1);
//         //     res2 = await pool.query(query1, [vendor1]);
//         // } else {
//         //     res2 = null;
//         // }

//         // if (ccc1) {
//         //     const query2 = `
//         //         SELECT DISTINCT (cccid)  
//         //         FROM public.ccc WHERE cccname = $1;
//         //     `;
//         //     console.log("query details", query2);
//         //     res1 = await pool.query(query2, [ccc1]);
//         // } else {
//         //     res1 = null;
//         // }

//         // if (zone1) {
//         //     const query3 = `
//         //         SELECT DISTINCT (zoneid)  
//         //         FROM public.zone WHERE zonename = $1;
//         //     `;
//         //     console.log("query details", query3);
//         //     res3 = await pool.query(query3, [zone1]);
//         // } else {
//         //     res3 = null;
//         // }

//         // if (district1) {
//         //     const query4 = `
//         //         SELECT DISTINCT (districtid)  
//         //         FROM public.district WHERE districtname = $1;
//         //     `;
//         //     console.log("query details", query4);
//         //     res4 = await pool.query(query4, [district1]);
//         // } else {
//         //     res4 = null;
//         // }

//         // if (division1) {
//         //     const query5 = `
//         //         SELECT DISTINCT (divisionid)  
//         //         FROM public.division WHERE divisionoffice = $1;
//         //     `;
//         //     console.log("query details", query5);
//         //     res5 = await pool.query(query5, [division1]);
//         // } else {
//         //     res5 = null;
//         // }


//         let query = `
//             SELECT
//                 EXTRACT(MONTH FROM CAST("installationdate" AS DATE)) AS month`;                        // Add conditions based on meter type
//         if (meterType === 'all') {
//             query += `, (target1phaseconsumermeter +
//                     target3phaseconsumermeter + 
//                     targetfeedermeter + 
//                     targetdtmeter) AS total_target_installation,
//                 (actual1phaseconsumermeter +
//                     actual3phaseconsumermeter + 
//                     actualfeedermeter +
//                     actualdtmeter) AS total_actual_installation`; 
//         }
//         else if (meterType === 'consumer') {
//             query += `, (target1phaseconsumermeter +
//                     target3phaseconsumermeter ) AS total_target_installation,
//                 (actual1phaseconsumermeter +
//                     actual3phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'system') {
//             query += `, (targetfeedermeter + 
//                     targetdtmeter) AS total_target_installation,
//                 (actualfeedermeter +
//                     actualdtmeter) AS total_actual_installation`;

//         }
//         else if (meterType === '1phase') {
//             query += `, (target1phaseconsumermeter ) AS total_target_installation,
//                 (actual1phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === '3phase') {
//             query += `, (target3phaseconsumermeter ) AS total_target_installation,
//                 (actual3phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'ltct') {
//             query += `, (targetdtmeter) AS total_target_installation,
//                 (actualdtmeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'feeder') {
//             query += `, ( 
//                     targetfeedermeter 
//                     ) AS total_target_installation,
//                 (actualfeedermeter ) AS total_actual_installation`;

//         }
//         query+=
//             ` FROM
//                 public.cccmeterinstallation
//             WHERE
//                 EXTRACT(YEAR FROM CAST("installationdate" AS DATE)) = ${year}`; 
        
//         if (vendor1) {
//             query += ` AND vendorid = (SELECT vendorid FROM public.vendor WHERE vendorname = '${vendor1}' LIMIT 1)`;
//         }

//         if (ccc1) {
//             query += ` AND cccid = (SELECT cccid FROM public.ccc WHERE cccname = '${ccc1}' LIMIT 1)`;
//         }

//         if (zone1) {
//             query += ` AND zoneid = (SELECT zoneid FROM public.zone WHERE zonename = '${zone1}' LIMIT 1)`;
//         }

//         if (district1) {
//             query += ` AND districtid = (SELECT districtid FROM public.district WHERE districtname = '${district1}' LIMIT 1)`;
//         }

//         if (division1) {
//             query += ` AND divisionid = (SELECT divisionid FROM public.division WHERE divisionoffice = '${division1}' LIMIT 1)`;
//         }


//         query+=

//             `
//             ORDER BY
//                 month;
//                 `;
//         console.log("query:" ,query);
//         const result = await pool.query(query);


//         const rawData = result.rows.map(row => ({
//             month: row.month,
//             total_target_installation: row.total_target_installation,
//             total_meter_installation: row.total_actual_installation
//         }));

//         res.status(200).json(rawData);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });


// router.get('/fetch_months', async (req, res) => {
//   try {
//     const year = req.query.year; // Get the year from query parameters
//     if (!year) {
//       return res.status(400).json({ error: 'Year is required' });
//     }
//     console.log("year received from frontend", year);

//     // Query to fetch distinct months for a given year
//     const query = `
//         SELECT DISTINCT 
//             TO_CHAR(CAST(installationdate AS DATE), 'Month') AS month_name,
//             EXTRACT(MONTH FROM CAST(installationdate AS DATE)) AS month_number
//         FROM 
//             public.cccmeterinstallation
//         WHERE 
//             EXTRACT(YEAR FROM CAST(installationdate AS DATE)) = $1
//         ORDER BY 
//             month_number;
//     `;

//     // Execute the query with the year parameter
//     const result = await pool.query(query, [year]);

//     // Map over the results to get an array of month names
//     const months = result.rows.map(row => row.month_name.trim());

//     console.log("Months received", months);

//     res.status(200).json(months);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/fetch_total_ccc_meter_installation', async (req, res) => {
//     try {
//         const year = parseInt(req.query.selectedYear, 10);
//         const month = req.query.selectedMonth;
//         const ccc1 = req.query.selectedCCC;
//         const zone1 = req.query.selectedZone;
//         const district1 = req.query.selectedDistrict;
//         const division1 = req.query.selectedDivision;
//         console.log(" ccc :",ccc1);
//         const meterType = req.query.meterType; // New query parameter for meter type
//         const vendor1 = req.query.selectedVendor; // New query parameter for vendor name
//         console.log("type of meter",meterType);
//         console.log("vendor name", vendor1);


//         let query = `
//             SELECT`;                        // Add conditions based on meter type
//         if (meterType === 'all') {
//             query += ` (target1phaseconsumermeter +
//                     target3phaseconsumermeter + 
//                     targetfeedermeter + 
//                     targetdtmeter) AS total_target_installation,
//                 (actual1phaseconsumermeter +
//                     actual3phaseconsumermeter + 
//                     actualfeedermeter +
//                     actualdtmeter) AS total_actual_installation`; 
//         }
//         else if (meterType === 'consumer') {
//             query += ` (target1phaseconsumermeter +
//                     target3phaseconsumermeter ) AS total_target_installation,
//                 (actual1phaseconsumermeter +
//                     actual3phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'system') {
//             query += ` (targetfeedermeter + 
//                     targetdtmeter) AS total_target_installation,
//                 (actualfeedermeter +
//                     actualdtmeter) AS total_actual_installation`;

//         }
//         else if (meterType === '1phase') {
//             query += ` (target1phaseconsumermeter ) AS total_target_installation,
//                 (actual1phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === '3phase') {
//             query += ` (target3phaseconsumermeter ) AS total_target_installation,
//                 (actual3phaseconsumermeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'ltct') {
//             query += ` (targetdtmeter) AS total_target_installation,
//                 (actualdtmeter) AS total_actual_installation`;

//         }
//         else if (meterType === 'feeder') {
//             query += ` ( 
//                     targetfeedermeter 
//                     ) AS total_target_installation,
//                 (actualfeedermeter ) AS total_actual_installation`;

//         }
//         query+=
//             ` FROM
//                 public.cccmeterinstallation
//             WHERE
//                 `; 

//         if (year){
//             query+=`EXTRACT(YEAR FROM CAST("installationdate" AS DATE)) = ${year} `;
//         }

//         if (month){
//             query+=` AND TRIM(TO_CHAR(CAST("installationdate" AS DATE), 'Month')) = '${month}'`;
//         }        
        
//         if (vendor1) {
//             query += ` AND vendorid = (SELECT vendorid FROM public.vendor WHERE vendorname = '${vendor1}' LIMIT 1)`;
//         }

//         if (ccc1) {
//             query += ` AND cccid = (SELECT cccid FROM public.ccc WHERE cccname = '${ccc1}' LIMIT 1)`;
//         }

//         if (zone1) {
//             query += ` AND zoneid = (SELECT zoneid FROM public.zone WHERE zonename = '${zone1}' LIMIT 1)`;
//         }

//         if (district1) {
//             query += ` AND districtid = (SELECT districtid FROM public.district WHERE districtname = '${district1}' LIMIT 1)`;
//         }

//         if (division1) {
//             query += ` AND divisionid = (SELECT divisionid FROM public.division WHERE divisionoffice = '${division1}' LIMIT 1)`;
//         }


//         query+=

//             `;
//                 `;
//         console.log("query:" ,query);
//         const result = await pool.query(query);


//         const rawData = result.rows.map(row => ({
//             month: row.month,
//             total_target_installation: row.total_target_installation,
//             total_meter_installation: row.total_actual_installation
//         }));

//         res.status(200).json(rawData);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

// //apis related to usermanagement

// router.post('/submitData', async (req, res) => {
//   try {
//     const userData = req.body;
//     // Begin a transaction
//     await pool.query('BEGIN');
//     for (const user of userData) {
//       // Construct INSERT query
//       const query = 'INSERT INTO usermanagement (sl_no, first_name, last_name, employee_id, email_id, phone_number, state, organisation, department, sub_department, designation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
//       const values = [user.sl_no, user.first_name, user.last_name, user.employee_id, user.email_id, user.phone_number, user.state, user.organisation, user.department, user.sub_department, user.designation];
//       await pool.query(query, values);
//     }
//     // Commit transaction
//     await pool.query('COMMIT');
//     res.status(200).json({ message: 'Data submitted successfully' });
//   } catch (error) {
//     // Rollback in case of error
//     await pool.query('ROLLBACK');
//     console.error('Error in /submitData:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/departments', async (req, res) => {
//   try {
//     const query = 'SELECT DISTINCT department FROM usermanagement';
//     const result = await pool.query(query);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/designations', async (req, res) => {
//   try {
//     const query = 'SELECT DISTINCT designation FROM usermanagement';
//     const result = await pool.query(query);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching designations:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/allData', async (req, res) => {
//   try {
//     const query = 'SELECT * FROM usermanagement';
//     const result = await pool.query(query);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching all data:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


// //survery report api

// router.get('/survey_report', async (req, res) => {
//   try {
//     console.log("in api");
//     const query = `SELECT 
//                         SM.RecordID, 
//                         SM.UserID, 
//                         SM.UploadedTime, 
//                         SM.InstallerName, 
//                         SM.MeterInstallationType, 
//                         SM.GISLocation, 
//                         SM.SubDivision, 
//                         SM.Division, 
//                         SM.UID, 
//                         SM.Section, 
//                         SM.GSS_PSSName, 
//                         SM.FeederName, 
//                         SM.FeederCode, 
//                         SM.DTLocation, 
//                         SM.DTCodeName, 
//                         SM.DTName, 
//                         SM.DTCode, 
//                         SM.BillAvailable,
//                         SM.MeterBillPhoto, 
//                         SM.RSSI,
//                         CI.ConsumerID, 
//                         CI.ActualConsumerAccountNo, 
//                         CI.KNO, 
//                         CI.ConsumerName, 
//                         CI.ConsumerAddress, 
//                         CI.ConsumerMobileNumber, 
//                         CI.EmailID, 
//                         CI.Landmark,
//                         CI.OldConnectionType, 
//                         CI.TariffCode, 
//                         CI.NatureOfPremises,
//                         OMI.SurveyedMeterSerialNo, 
//                         OMI.ActualOldMeterSerialNo, 
//                         OMI.OldMeterType, 
//                         OMI.OldMeterMake, 
//                         OMI.OldMeterCondition, 
//                         OMI.OldMeterReadingVisible, 
//                         OMI.OldMeterPONo, 
//                         OMI.OldMeterTenderNo, 
//                         OMI.OldMeterFinalReading_KWH, 
//                         OMI.OldMeterFinalReadingPhoto,
//                         AAD.Approval, 
//                         AAD.Remarks, 
//                         AAD.RejectionReason,
//                         OCI.OldCableID, 
//                         OCI.OldCableCondition, 
//                         OCI.OldCableReplacement, 
//                         OCI.OldCableReplacementRemark, 
//                         OCI.OldCableType, 
//                         OCI.OldCableLength_Mtr,
//                         NMI.MeteringMode, 
//                         NMI.NewMeterConnectionType, 
//                         NMI.NewMeterSerialNo, 
//                         NMI.NewMeterReadingInKWH, 
//                         NMI.MeterLocation, 
//                         NMI.MeterInstalledAt, 
//                         NMI.TerminalSeal1, 
//                         NMI.TerminalSeal2, 
//                         NMI.MeterBoxSeal1, 
//                         NMI.MeterBoxSeal2, 
//                         NMI.NewMeterInitialReadingPhoto, 
//                         NMI.NewMeterPhotowithMeterNumber,   
//                         NCI.NewCableInstallationRequirement, 
//                         NCI.NewCableLengthUsed,
//                         PAI.Latitude, 
//                         PAI.Longitude, 
//                         PAI.CapturePremisePhotoWithMeter, 
//                         RI.ConsumerAvailable, 
//                         RI.ConsumerRepName, 
//                         RI.ConsumerRepSignature, 
//                         RI.InstallationTeamMemberSignature,
//                         RMA.Approval AS RemarksAndApproval_Approval, 
//                         RMA.Remarks AS RemarksAndApproval_Remarks, 
//                         RMA.RejectionReason AS RemarksAndApproval_RejectionReason,
//                         CI2.PdfFilePath, 
//                         CI2.ContractorName, 
//                         CI2.InstallationDate, 
//                         CI2.TimeOfInstallation, 
//                         CI2.MeterReadingFromSurvey
//                         FROM SurveyMaster SM
//                         INNER JOIN ConsumerInformation CI ON SM.RecordID = CI.RecordID
//                         INNER JOIN OldMeterInformation OMI ON SM.RecordID = OMI.RecordID
//                         INNER JOIN ApprovalAndDifference AAD ON SM.RecordID = AAD.RecordID
//                         INNER JOIN OldCableInformation OCI ON SM.RecordID = OCI.RecordID
//                         INNER JOIN NewMeterInstallation NMI ON SM.RecordID = NMI.RecordID
//                         INNER JOIN NewCableInformation NCI ON SM.RecordID = NCI.RecordID
//                         INNER JOIN PhotosAndAdditionalInformation PAI ON SM.RecordID = PAI.RecordID
//                         INNER JOIN RepresentativeInformation RI ON SM.RecordID = RI.RecordID
//                         INNER JOIN RemarksAndApproval RMA ON SM.RecordID = RMA.RecordID
//                         INNER JOIN ContractorInformation CI2 ON SM.RecordID = CI2.RecordID;
// `;
//     const result = await pool.query(query);
//     console.log("result of api", result.rows);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching all data:', error);
//     res.status(500).json({ error: error.message });
//   }

  
// });


module.exports = router;
