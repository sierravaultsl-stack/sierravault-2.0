import "dotenv/config";
// Native fetch in Node 18+

const BASE_URL = "http://localhost:3000";
let govCookie = "";
let citizenCookie = "";
let citizenId = "";
let citizenNIN = "SL123456789";
let createdDocId = "";

async function login(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Login failed: ${data.error}`);

    // Extract cookie
    const cookieHeader = res.headers.get("set-cookie");
    if (!cookieHeader) throw new Error("No cookie received");

    // Simple parse for 'token'
    const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='));
    return { token: token, user: data.user };
}

async function runTests() {
    try {
        console.log("🚀 Starting E2E Tests...\n");

        // 1. Login as Admin
        console.log("[1] Logging in as Gov Admin...");
        const adminAuth = await login("admin@gov.sl", "password123");
        govCookie = adminAuth.token;
        console.log("✅ Admin Logged In");

        // 2. Login as Citizen
        console.log("[2] Logging in as Citizen...");
        const citizenAuth = await login("citizen@sierra.sl", "password123");
        citizenCookie = citizenAuth.token;
        citizenId = citizenAuth.user._id;
        console.log("✅ Citizen Logged In");

        // 3. Gov Issues Document
        console.log("[3] Gov Issuing Document to Citizen...");
        const issueRes = await fetch(`${BASE_URL}/api/gov/issue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": govCookie
            },
            body: JSON.stringify({
                nin: citizenNIN,
                type: "Birth Certificate",
                title: "Official Birth Cert",
                url: "http://gov.sl/docs/birth123.pdf",
                metadata: { source: "test-script" }
            })
        });
        const issueData = await issueRes.json();
        if (!issueRes.ok) throw new Error(`Issue failed: ${JSON.stringify(issueData)}`);
        console.log("✅ Document Issued:", issueData.document._id);

        // 4. Citizen Uploads Document (Pending)
        console.log("[4] Citizen Uploading Self-Declared Doc...");
        const uploadRes = await fetch(`${BASE_URL}/api/documents/upload`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": citizenCookie
            },
            body: JSON.stringify({
                type: "Land Title",
                title: "My Land Deed",
                url: "http://mys3.com/land.pdf",
                sizeBytes: 1024,
                mimeType: "application/pdf"
            })
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
        createdDocId = uploadData.document._id;
        console.log("✅ Upload Successful (Pending Verification):", createdDocId);

        // 5. Gov Sees Request
        console.log("[5] Gov Checking Verification Queue...");
        const reqRes = await fetch(`${BASE_URL}/api/gov/requests`, {
            headers: { "Cookie": govCookie }
        });
        const reqData = await reqRes.json();
        const found = reqData.data.find(d => d._id === createdDocId);
        if (!found) throw new Error("Uploaded doc not found in Gov Queue");
        console.log("✅ Document found in Queue");

        // 6. Gov Verifies Document
        console.log("[6] Gov Verifying Document...");
        const verifyRes = await fetch(`${BASE_URL}/api/gov/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": govCookie
            },
            body: JSON.stringify({
                documentId: createdDocId,
                decision: "APPROVE",
                reason: "Looks legit"
            })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(`Verification failed: ${JSON.stringify(verifyData)}`);
        if (verifyData.document.status !== 'VERIFIED') throw new Error("Status not updated to VERIFIED");
        console.log("✅ Document Verified");

        // 7. Citizen Lists Documents (Check URL hidden)
        console.log("[7] Citizen Listing Documents...");
        const listRes = await fetch(`${BASE_URL}/api/citizen/documents`, {
            headers: { "Cookie": citizenCookie }
        });
        const listData = await listRes.json();
        const myDoc = listData.documents.find(d => d._id === createdDocId);
        if (myDoc.url) throw new Error("SECURITY FAIL: URL should be hidden in list view");
        console.log("✅ Listing success (URL hidden)");

        // 8. Step-Up Auth & View
        console.log("[8] Step-Up Auth & Secure View...");
        // Get Step-Up Token
        const stepUpRes = await fetch(`${BASE_URL}/api/auth/step-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": citizenCookie
            },
            body: JSON.stringify({ password: "password123" })
        });
        const stepUpData = await stepUpRes.json();
        if (!stepUpData.token) throw new Error("Step-Up failed");
        const stepToken = stepUpData.token;

        // View Doc with Token
        const viewRes = await fetch(`${BASE_URL}/api/documents/${createdDocId}/view`, {
            headers: {
                "Cookie": citizenCookie,
                "Authorization": `Bearer ${stepToken}`
            }
        });
        const viewData = await viewRes.json();
        if (!viewData.url) throw new Error("Secure View failed to return URL");
        console.log("✅ Secure View Success! URL:", viewData.url);

        console.log("\n🎉 ALL TESTS PASSED!");

    } catch (e) {
        console.error("\n❌ TEST FAILED:", e.message);
        process.exit(1);
    }
}

runTests();
