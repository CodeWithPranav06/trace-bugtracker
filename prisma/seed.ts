import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.bugLabel.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bug.deleteMany();
  await prisma.label.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Alice Chen",
      email: "alice@trace.dev",
      passwordHash,
      role: "admin",
    },
  });

  const dev1 = await prisma.user.create({
    data: {
      name: "Bob Martinez",
      email: "bob@trace.dev",
      passwordHash,
      role: "developer",
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      name: "Carol Zhang",
      email: "carol@trace.dev",
      passwordHash,
      role: "developer",
    },
  });

  const reporter = await prisma.user.create({
    data: {
      name: "Dave Wilson",
      email: "dave@trace.dev",
      passwordHash,
      role: "reporter",
    },
  });

  console.log("✅ Created 4 users");

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: "UI", color: "#3b82f6" } }),
    prisma.label.create({ data: { name: "Backend", color: "#10b981" } }),
    prisma.label.create({ data: { name: "Performance", color: "#f59e0b" } }),
    prisma.label.create({ data: { name: "Security", color: "#ef4444" } }),
    prisma.label.create({ data: { name: "Documentation", color: "#8b5cf6" } }),
    prisma.label.create({ data: { name: "API", color: "#06b6d4" } }),
  ]);

  console.log("✅ Created 6 labels");

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Trace Frontend",
      description: "The Trace web application frontend — built with Next.js and React",
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Trace API",
      description: "Core REST API and backend services for the Trace platform",
      ownerId: dev1.id,
    },
  });

  console.log("✅ Created 2 projects");

  // Create bugs for Project 1 (Trace Frontend)
  const bugs = [];

  // Bug 1 - Critical, Open
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Login page crashes on invalid email format",
        description: `## Description\n\nWhen a user enters an email without the @ symbol and clicks "Log In", the entire page crashes with an unhandled TypeError.\n\n## Steps to Reproduce\n\n1. Navigate to /login\n2. Enter \"notanemail\" in the email field\n3. Click the Log In button\n4. Page goes white with error overlay\n\n## Expected Behavior\n\nForm validation should catch invalid email format and show an inline error message.\n\n## Actual Behavior\n\nUnhandled exception: \`TypeError: Cannot read properties of undefined (reading 'split')\``,
        status: "Open",
        severity: "Critical",
        priority: "P0",
        reporterId: reporter.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 2 - Major, In Progress
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Dark mode colors not applying to dropdown menus",
        description: `## Description\n\nDropdown menus (severity picker, priority picker, assignee picker) don't respect the dark mode theme. They render with light backgrounds against the dark page background, making text nearly invisible.\n\n## Screenshots\n\nDropdown appears as a white box on dark background — text is white-on-white.\n\n## Expected\n\nDropdowns should use dark theme colors consistent with the rest of the app.`,
        status: "In Progress",
        severity: "Major",
        priority: "P1",
        reporterId: admin.id,
        assigneeId: dev2.id,
      },
    })
  );

  // Bug 3 - Minor, In Review
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Bug list pagination shows wrong total count",
        description: `The pagination component at the bottom of the bug list shows "Showing 1-10 of 5" when there are only 5 bugs. It seems to be using an incorrect total count, possibly from a cached query.`,
        status: "In Review",
        severity: "Minor",
        priority: "P2",
        reporterId: dev1.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 4 - Trivial, Resolved
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Typo in footer: 'Copyrigth' instead of 'Copyright'",
        description: `Simple typo in the app footer. The word "Copyright" is misspelled as "Copyrigth".`,
        status: "Resolved",
        severity: "Trivial",
        priority: "P3",
        reporterId: reporter.id,
        assigneeId: dev2.id,
      },
    })
  );

  // Bug 5 - Major, Open
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "File upload fails silently for files > 5MB",
        description: `## Description\n\nWhen attempting to upload an attachment larger than 5MB, the upload spinner appears briefly and then disappears. No error message is shown, and the file is not attached to the bug.\n\n## Expected Behavior\n\nEither:\n1. Accept larger files (up to 25MB), or\n2. Show a clear error message: "File size exceeds the 5MB limit"\n\n## Environment\n\n- Browser: Chrome 120\n- File tested: screenshot.png (7.2MB)`,
        status: "Open",
        severity: "Major",
        priority: "P1",
        reporterId: dev2.id,
        assigneeId: null,
      },
    })
  );

  // Bug 6 - Critical, In Progress
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Session expires but UI doesn't redirect to login",
        description: `After the JWT token expires (1 hour), the app remains on the current page but all API calls fail with 401. The user sees broken UI with empty data instead of being redirected to the login page.`,
        status: "In Progress",
        severity: "Critical",
        priority: "P0",
        reporterId: admin.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 7 - Minor, Closed
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Sidebar collapse animation is janky on Firefox",
        description: `The sidebar collapse/expand animation stutters on Firefox 121. Smooth on Chrome and Safari. Likely a CSS transition issue with the transform property.`,
        status: "Closed",
        severity: "Minor",
        priority: "P3",
        reporterId: reporter.id,
        assigneeId: dev2.id,
      },
    })
  );

  // Bug 8 - Major, Open (Project 2)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project2.id,
        title: "GET /api/bugs returns 500 when filter includes special characters",
        description: `## Description\n\nWhen the search query parameter contains characters like \`&\`, \`<\`, or \`'\`, the API returns a 500 Internal Server Error instead of escaping them properly.\n\n## Reproduction\n\n\`\`\`bash\ncurl 'https://api.trace.dev/bugs?search=can%27t+reproduce'\n# Returns: 500 Internal Server Error\n\`\`\`\n\n## Root Cause (suspected)\n\nThe search parameter is being interpolated directly into the SQL query without parameterization.`,
        status: "Open",
        severity: "Major",
        priority: "P0",
        reporterId: dev1.id,
        assigneeId: dev2.id,
      },
    })
  );

  // Bug 9 - Minor, Open (Project 2)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project2.id,
        title: "API response time degrades after 1000+ bugs in a project",
        description: `Performance testing shows that the GET /api/projects/:id/bugs endpoint response time increases from ~50ms to ~2s when a project has more than 1000 bugs. Missing database index on projectId + status composite.`,
        status: "Open",
        severity: "Minor",
        priority: "P2",
        reporterId: admin.id,
        assigneeId: null,
      },
    })
  );

  // Bug 10 - Critical, Resolved (Project 2)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project2.id,
        title: "Authentication bypass via expired JWT tokens",
        description: `## Security Issue\n\nExpired JWT tokens are still accepted by the API middleware. The \`exp\` claim is present in the token but not being validated during the verification step.\n\n## Impact\n\nAny user who has ever had a valid token can continue making authenticated API calls indefinitely.\n\n## Fix Required\n\nAdd \`exp\` validation to the JWT verification middleware.`,
        status: "Resolved",
        severity: "Critical",
        priority: "P0",
        reporterId: dev2.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 11 - Trivial, Open (Project 2)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project2.id,
        title: "API docs example uses deprecated endpoint format",
        description: `The API documentation at /docs still references the old endpoint format \`/api/v1/bugs\` instead of the current \`/api/bugs\`. Several curl examples will fail if copy-pasted.`,
        status: "Open",
        severity: "Trivial",
        priority: "P3",
        reporterId: reporter.id,
        assigneeId: null,
      },
    })
  );

  // Bug 12 - Major, In Progress (Project 2)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project2.id,
        title: "Rate limiting not applied to login endpoint",
        description: `The POST /api/auth/login endpoint has no rate limiting. An attacker could brute-force passwords without any throttling. We need to add rate limiting (e.g., 5 attempts per minute per IP).`,
        status: "In Progress",
        severity: "Major",
        priority: "P1",
        reporterId: admin.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 13 - Minor, Open (Project 1)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Dashboard chart doesn't update when date range changes",
        description: `Changing the date range selector on the dashboard (Last 7 days / Last 30 days / All time) doesn't refresh the chart data. The chart always shows the default 30-day view.`,
        status: "Open",
        severity: "Minor",
        priority: "P2",
        reporterId: dev1.id,
        assigneeId: null,
      },
    })
  );

  // Bug 14 - Major, Open (Project 1)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Markdown XSS vulnerability in bug descriptions",
        description: `## Security\n\nBug descriptions rendered via markdown allow raw HTML including script tags. A malicious user could inject \`<script>alert('xss')</script>\` in a bug description and it would execute when other users view the bug.\n\n## Fix\n\nSanitize HTML output from the markdown renderer. Use rehype-sanitize or similar.`,
        status: "Open",
        severity: "Major",
        priority: "P0",
        reporterId: dev2.id,
        assigneeId: dev1.id,
      },
    })
  );

  // Bug 15 - Trivial, Closed (Project 1)
  bugs.push(
    await prisma.bug.create({
      data: {
        projectId: project1.id,
        title: "Favicon is still the default Next.js icon",
        description: `The app is using the default Next.js favicon. Should be replaced with the Trace logo.`,
        status: "Closed",
        severity: "Trivial",
        priority: "P3",
        reporterId: reporter.id,
        assigneeId: dev2.id,
      },
    })
  );

  console.log(`✅ Created ${bugs.length} bugs`);

  // Add labels to bugs
  await prisma.bugLabel.createMany({
    data: [
      { bugId: bugs[0].id, labelId: labels[0].id }, // Login crash -> UI
      { bugId: bugs[1].id, labelId: labels[0].id }, // Dark mode -> UI
      { bugId: bugs[2].id, labelId: labels[0].id }, // Pagination -> UI
      { bugId: bugs[4].id, labelId: labels[0].id }, // File upload -> UI
      { bugId: bugs[4].id, labelId: labels[1].id }, // File upload -> Backend
      { bugId: bugs[5].id, labelId: labels[3].id }, // Session -> Security
      { bugId: bugs[6].id, labelId: labels[0].id }, // Sidebar -> UI
      { bugId: bugs[7].id, labelId: labels[5].id }, // API 500 -> API
      { bugId: bugs[7].id, labelId: labels[3].id }, // API 500 -> Security
      { bugId: bugs[8].id, labelId: labels[2].id }, // Perf -> Performance
      { bugId: bugs[8].id, labelId: labels[5].id }, // Perf -> API
      { bugId: bugs[9].id, labelId: labels[3].id }, // Auth bypass -> Security
      { bugId: bugs[10].id, labelId: labels[4].id }, // Docs -> Documentation
      { bugId: bugs[11].id, labelId: labels[3].id }, // Rate limit -> Security
      { bugId: bugs[11].id, labelId: labels[5].id }, // Rate limit -> API
      { bugId: bugs[12].id, labelId: labels[0].id }, // Chart -> UI
      { bugId: bugs[13].id, labelId: labels[3].id }, // XSS -> Security
      { bugId: bugs[13].id, labelId: labels[0].id }, // XSS -> UI
    ],
  });

  console.log("✅ Added labels to bugs");

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        bugId: bugs[0].id,
        authorId: dev1.id,
        body: "I can reproduce this. The issue is in the `validateEmail` utility — it calls `.split('@')` without checking if the input contains `@` first. Quick fix incoming.",
      },
      {
        bugId: bugs[0].id,
        authorId: admin.id,
        body: "This is blocking user signups in production. Can we get a hotfix out today?",
      },
      {
        bugId: bugs[0].id,
        authorId: dev1.id,
        body: "PR is up: #247. Added null check and proper email regex validation. Also added unit tests for edge cases.",
      },
      {
        bugId: bugs[1].id,
        authorId: dev2.id,
        body: "Working on this now. The issue is that dropdown menus are rendered via a Portal outside the theme provider wrapper. Need to move the theme class to the `<html>` element.",
      },
      {
        bugId: bugs[1].id,
        authorId: admin.id,
        body: "Good catch. Let's also audit other portal-based components (modals, tooltips) for the same issue.",
      },
      {
        bugId: bugs[5].id,
        authorId: dev1.id,
        body: "I'm adding an axios interceptor that checks for 401 responses and triggers a redirect to `/login`. Also adding a token refresh mechanism using refresh tokens.",
      },
      {
        bugId: bugs[7].id,
        authorId: dev2.id,
        body: "Confirmed — this is a SQL injection vector. The `search` parameter is concatenated directly into the query string. Switching to parameterized queries now. This is a **P0 security fix**.",
      },
      {
        bugId: bugs[7].id,
        authorId: admin.id,
        body: "@carol please also add input sanitization at the middleware level as defense-in-depth. We should never trust user input reaching the query layer.",
      },
      {
        bugId: bugs[9].id,
        authorId: dev1.id,
        body: "Fixed in commit `a3f8c2d`. Added `exp` claim validation and also implemented token refresh rotation. All existing tokens will be invalidated — users will need to re-authenticate.",
      },
      {
        bugId: bugs[9].id,
        authorId: admin.id,
        body: "Good fix. Let's also add a security advisory to the changelog. Marking as resolved.",
      },
      {
        bugId: bugs[13].id,
        authorId: dev1.id,
        body: "I'll take this. We need to add `rehype-sanitize` to the markdown pipeline. It should strip all raw HTML by default and only allow safe elements like `<em>`, `<strong>`, `<code>`.",
      },
    ],
  });

  console.log("✅ Created comments");

  // Create activities
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  await prisma.activity.createMany({
    data: [
      {
        bugId: bugs[0].id,
        actorId: reporter.id,
        action: "created",
        createdAt: daysAgo(5),
      },
      {
        bugId: bugs[1].id,
        actorId: admin.id,
        action: "created",
        createdAt: daysAgo(4),
      },
      {
        bugId: bugs[1].id,
        actorId: dev2.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "In Progress",
        createdAt: daysAgo(3),
      },
      {
        bugId: bugs[2].id,
        actorId: dev1.id,
        action: "created",
        createdAt: daysAgo(7),
      },
      {
        bugId: bugs[2].id,
        actorId: dev1.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "In Progress",
        createdAt: daysAgo(5),
      },
      {
        bugId: bugs[2].id,
        actorId: dev1.id,
        action: "status_change",
        field: "status",
        oldValue: "In Progress",
        newValue: "In Review",
        createdAt: daysAgo(3),
      },
      {
        bugId: bugs[3].id,
        actorId: reporter.id,
        action: "created",
        createdAt: daysAgo(10),
      },
      {
        bugId: bugs[3].id,
        actorId: dev2.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "Resolved",
        createdAt: daysAgo(8),
      },
      {
        bugId: bugs[5].id,
        actorId: admin.id,
        action: "created",
        createdAt: daysAgo(2),
      },
      {
        bugId: bugs[5].id,
        actorId: dev1.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "In Progress",
        createdAt: daysAgo(1),
      },
      {
        bugId: bugs[6].id,
        actorId: reporter.id,
        action: "created",
        createdAt: daysAgo(14),
      },
      {
        bugId: bugs[6].id,
        actorId: dev2.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "Closed",
        createdAt: daysAgo(10),
      },
      {
        bugId: bugs[9].id,
        actorId: dev2.id,
        action: "created",
        createdAt: daysAgo(6),
      },
      {
        bugId: bugs[9].id,
        actorId: dev1.id,
        action: "status_change",
        field: "status",
        oldValue: "Open",
        newValue: "Resolved",
        createdAt: daysAgo(4),
      },
    ],
  });

  console.log("✅ Created activities");
  console.log("\n🎉 Seed complete!");
  console.log("\n📧 Demo accounts (all passwords: password123):");
  console.log("   Admin:     alice@trace.dev");
  console.log("   Developer: bob@trace.dev");
  console.log("   Developer: carol@trace.dev");
  console.log("   Reporter:  dave@trace.dev");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
