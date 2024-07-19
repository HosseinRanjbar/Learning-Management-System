const  { PrismaClient } = require("@prisma/client") ;


const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "کامپیوتر"},
                {name: "موسیقی"},
                {name: "ورزش و بدنسازی"},
                {name: "عکاسی"},
                {name: "حسابداری"},
                {name: "مهندسی"},
                {name: "آشپزی و شیرینی پزی"},
                {name: "فیلم"},
            ]
        })
        console.log('success');
        
    } catch (error) {
        console.log('Error seeding the database categories',error);
        
    }finally{
        await database.$disconnect()
    }
}

main()