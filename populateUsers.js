const mongoose = require('mongoose')
const faker = require('@faker-js/faker').faker
const bcrypt = require('bcryptjs')
const User = require('./models/userModel')
const connectDB = require("./config/db");

connectDB()

const populateUser = async () =>{
    try{
        const pWord = '12334'
        const hashedPassword = await bcrypt.hash(pWord, 10)


        const users = []
        for(i = 0; i < 28; i++) {
                users.push({
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    password: hashedPassword,
                })
        }

            await User.insertMany(users)
            console.log("Users Successfully populated")


    }catch(err){
        console.error("Error populating users:", err.message);
    }
}


populateUser()