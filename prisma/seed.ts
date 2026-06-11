import { PrismaClient, UserRole, RSVPStatus, DietaryPreference, VendorStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function generateQRHash(): string {
  return crypto.randomBytes(32).toString('hex');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.guestCheckInRecord.deleteMany({});
  await prisma.mediaAsset.deleteMany({});
  await prisma.guest.deleteMany({});
  await prisma.guestGroup.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users
  console.log('👤 Creating users...');
  const hostUser = await prisma.user.create({
    data: {
      email: 'host@wedflo.com',
      password: await hashPassword('Host@123456'),
      role: UserRole.HOST,
    },
  });

  const photographerUser = await prisma.user.create({
    data: {
      email: 'photographer@wedflo.com',
      password: await hashPassword('Photographer@123456'),
      role: UserRole.PHOTOGRAPHER,
    },
  });

  const familyMemberUser = await prisma.user.create({
    data: {
      email: 'family@wedflo.com',
      password: await hashPassword('Family@123456'),
      role: UserRole.FAMILY_MEMBER,
    },
  });

  console.log('✅ Users created');

  // Create Events
  console.log('📅 Creating events...');
  const event1 = await prisma.event.create({
    data: {
      title: 'Sharma-Patel Grand Wedding',
      date: new Date('2024-12-15T18:00:00'),
      venue: 'The Grand Ballroom, New Delhi',
      budgetLimit: 500000,
      currentExpenses: 0,
      createdById: hostUser.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Gupta Family Celebration',
      date: new Date('2025-01-20T17:30:00'),
      venue: 'Taj Convention Center, Mumbai',
      budgetLimit: 750000,
      currentExpenses: 0,
      createdById: hostUser.id,
    },
  });

  console.log('✅ Events created');

  // Create Guest Groups
  console.log('👥 Creating guest groups...');
  const sharmaFamily = await prisma.guestGroup.create({
    data: {
      groupName: 'Sharma Family (Bride Side)',
      eventId: event1.id,
      totalAllocatedPlates: 35,
    },
  });

  const patelFamily = await prisma.guestGroup.create({
    data: {
      groupName: 'Patel Family (Groom Side)',
      eventId: event1.id,
      totalAllocatedPlates: 42,
    },
  });

  const guptaFriends = await prisma.guestGroup.create({
    data: {
      groupName: 'Friends & Colleagues',
      eventId: event1.id,
      totalAllocatedPlates: 28,
    },
  });

  const mishraFamily = await prisma.guestGroup.create({
    data: {
      groupName: 'Extended Family',
      eventId: event1.id,
      totalAllocatedPlates: 15,
    },
  });

  const guptaSide = await prisma.guestGroup.create({
    data: {
      groupName: 'Gupta Family (Main)',
      eventId: event2.id,
      totalAllocatedPlates: 50,
    },
  });

  const vermaFriends = await prisma.guestGroup.create({
    data: {
      groupName: 'Verma Friends Circle',
      eventId: event2.id,
      totalAllocatedPlates: 35,
    },
  });

  console.log('✅ Guest groups created');

  // Create Guests for Event 1
  console.log('🎫 Creating guests...');
  const event1Guests = [
    { name: 'Rajesh Sharma', email: 'rajesh.sharma@email.com', phone: '9876543210', groupId: sharmaFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '9876543211', groupId: sharmaFamily.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Arjun Sharma', email: 'arjun.sharma@email.com', phone: '9876543212', groupId: sharmaFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Anjali Sharma', email: 'anjali.sharma@email.com', phone: '9876543213', groupId: sharmaFamily.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Vikram Sharma', email: 'vikram.sharma@email.com', phone: '9876543214', groupId: sharmaFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.PENDING },
    { name: 'Anil Patel', email: 'anil.patel@email.com', phone: '8765432210', groupId: patelFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Deepika Patel', email: 'deepika.patel@email.com', phone: '8765432211', groupId: patelFamily.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Karan Patel', email: 'karan.patel@email.com', phone: '8765432212', groupId: patelFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Shreya Patel', email: 'shreya.patel@email.com', phone: '8765432213', groupId: patelFamily.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.PENDING },
    { name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '7654321210', groupId: guptaFriends.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '7654321211', groupId: guptaFriends.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Vikas Singh', email: 'vikas.singh@email.com', phone: '7654321212', groupId: guptaFriends.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Suresh Mishra', email: 'suresh.mishra@email.com', phone: '6543210987', groupId: mishraFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Meera Mishra', email: 'meera.mishra@email.com', phone: '6543210988', groupId: mishraFamily.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Rajiv Nair', email: 'rajiv.nair@email.com', phone: '6543210989', groupId: mishraFamily.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
  ];

  for (const guest of event1Guests) {
    await prisma.guest.create({
      data: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        groupId: guest.groupId,
        eventId: event1.id,
        rsvpStatus: guest.rsvp,
        dietaryPreference: guest.diet,
        qrCodeHash: generateQRHash(),
        checkedIn: guest.rsvp === RSVPStatus.CONFIRMED,
      },
    });
  }

  // Create Guests for Event 2
  const event2Guests = [
    { name: 'Rajendra Gupta', email: 'rajendra.gupta@email.com', phone: '9111111111', groupId: guptaSide.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Vandana Gupta', email: 'vandana.gupta@email.com', phone: '9111111112', groupId: guptaSide.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Nitin Gupta', email: 'nitin.gupta@email.com', phone: '9111111113', groupId: guptaSide.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Shalini Gupta', email: 'shalini.gupta@email.com', phone: '9111111114', groupId: guptaSide.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.PENDING },
    { name: 'Ramesh Verma', email: 'ramesh.verma@email.com', phone: '8111111111', groupId: vermaFriends.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Sunita Verma', email: 'sunita.verma@email.com', phone: '8111111112', groupId: vermaFriends.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Anuj Verma', email: 'anuj.verma@email.com', phone: '8111111113', groupId: vermaFriends.id, diet: DietaryPreference.NON_VEG, rsvp: RSVPStatus.CONFIRMED },
    { name: 'Riya Verma', email: 'riya.verma@email.com', phone: '8111111114', groupId: vermaFriends.id, diet: DietaryPreference.VEG, rsvp: RSVPStatus.CONFIRMED },
  ];

  for (const guest of event2Guests) {
    await prisma.guest.create({
      data: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        groupId: guest.groupId,
        eventId: event2.id,
        rsvpStatus: guest.rsvp,
        dietaryPreference: guest.diet,
        qrCodeHash: generateQRHash(),
        checkedIn: guest.rsvp === RSVPStatus.CONFIRMED,
      },
    });
  }

  console.log('✅ 23 guests created');

  // Create Vendors
  console.log('🍽️ Creating vendors...');
  const vendors = [
    { name: 'Royal Catering Co.', serviceType: 'Catering', cost: 150000, status: VendorStatus.PAID, eventId: event1.id },
    { name: 'Shine Photography', serviceType: 'Photography', cost: 75000, status: VendorStatus.PAID, eventId: event1.id },
    { name: 'Bloom Decorations', serviceType: 'Decoration', cost: 100000, status: VendorStatus.PENDING, eventId: event1.id },
    { name: 'DJ Pulse Entertainment', serviceType: 'Entertainment', cost: 50000, status: VendorStatus.PAID, eventId: event1.id },
    { name: 'Premium Feast Catering', serviceType: 'Catering', cost: 220000, status: VendorStatus.PAID, eventId: event2.id },
    { name: 'Memories Photography', serviceType: 'Photography', cost: 95000, status: VendorStatus.PENDING, eventId: event2.id },
    { name: 'Elegance Event Design', serviceType: 'Decoration', cost: 150000, status: VendorStatus.PAID, eventId: event2.id },
  ];

  for (const vendor of vendors) {
    await prisma.vendor.create({
      data: vendor,
    });
  }

  console.log('✅ 7 vendors created');

  // Create Check-in Records
  console.log('✅ Creating check-in records...');
  const confirmedGuests = await prisma.guest.findMany({
    where: {
      eventId: event1.id,
      rsvpStatus: RSVPStatus.CONFIRMED,
    },
    take: 5,
  });

  for (const guest of confirmedGuests) {
    await prisma.guestCheckInRecord.create({
      data: {
        guestId: guest.id,
        eventId: event1.id,
        checkedInByRole: UserRole.FAMILY_MEMBER,
      },
    });
  }

  console.log('✅ Check-in records created');

  // Create Media Assets
  console.log('📸 Creating media assets...');
  await prisma.mediaAsset.create({
    data: {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      uploadedByRole: 'PHOTOGRAPHER',
      uploadedByUserId: photographerUser.id,
      eventId: event1.id,
      metadata: {
        width: 1920,
        height: 1280,
        mimeType: 'image/jpeg',
        size: 2048000,
      },
    },
  });

  console.log('✅ Media assets created');

  // Update Event Expenses
  console.log('💰 Updating event expenses...');
  const event1Vendors = await prisma.vendor.findMany({ where: { eventId: event1.id } });
  const event1Total = event1Vendors.reduce((sum, v) => sum + v.cost, 0);
  
  const event2Vendors = await prisma.vendor.findMany({ where: { eventId: event2.id } });
  const event2Total = event2Vendors.reduce((sum, v) => sum + v.cost, 0);

  await prisma.event.update({
    where: { id: event1.id },
    data: { currentExpenses: event1Total },
  });

  await prisma.event.update({
    where: { id: event2.id },
    data: { currentExpenses: event2Total },
  });

  console.log('✅ Event expenses updated');

  console.log('\n🌟 Database seeding completed successfully!');
  console.log('\n📊 Seed Summary:');
  console.log('  ✅ 3 Users');
  console.log('  ✅ 2 Events');
  console.log('  ✅ 6 Guest Groups');
  console.log('  ✅ 23 Guests');
  console.log('  ✅ 7 Vendors');
  console.log('  ✅ 5 Check-in Records');
  console.log('  ✅ 1 Media Asset');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
