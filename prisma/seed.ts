import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  let ticketType = await prisma.ticketType.findFirst();
  if (!ticketType) {
    await prisma.ticketType.createMany({
      data:[{
        name: "Remoto",
        price: 40000,
        isRemote: true,
        includesHotel: false,
      },
      {
        name: "Presencial sem hotel",
        price: 65000,
        isRemote: false,
        includesHotel: false,
      },
      {
        name: "Presencial com hotel",
        price: 80000,
        isRemote: false,
        includesHotel: true,
      }]
    })
  }

  let hotel = await prisma.hotel.findFirst()
  if(!hotel){
    const firstHotel = await prisma.hotel.create({
      data:{
        name:"Estrela Dourada",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg"
      }
    })

    await prisma.room.createMany({
      data:[{
        name: '101',
        capacity: 1,
        hotelId: firstHotel.id
      },
      {
        name: '102',
        capacity: 2,
        hotelId: firstHotel.id
      },
      {
        name: '103',
        capacity: 3,
        hotelId: firstHotel.id
      },
      {
        name: '104',
        capacity: 2,
        hotelId: firstHotel.id
      },
      {
        name: '105',
        capacity: 3,
        hotelId: firstHotel.id
      },
      {
        name: '106',
        capacity: 1,
        hotelId: firstHotel.id
      }]
    })

    const secondHotel = await prisma.hotel.create({
      data:{
        name:"Paraíso Tropical",
        image: "https://www.cnnbrasil.com.br/viagemegastronomia/wp-content/uploads/sites/5/2022/04/rosewood-sao-paulo.jpg?w=876&h=484&crop=1"
      }
    })

    await prisma.room.createMany({
      data:[{
        name: '201',
        capacity: 1,
        hotelId: secondHotel.id
      },
      {
        name: '202',
        capacity: 2,
        hotelId: secondHotel.id
      },
      {
        name: '203',
        capacity: 3,
        hotelId: secondHotel.id
      },
      {
        name: '204',
        capacity: 2,
        hotelId: secondHotel.id
      },
      {
        name: '205',
        capacity: 3,
        hotelId: secondHotel.id
      },
      {
        name: '206',
        capacity: 1,
        hotelId: secondHotel.id
      }]
    })
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
