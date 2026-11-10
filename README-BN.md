# DIN HACKER TEAM STORE — GitHub Pages প্রস্তুত প্যাকেজ

## প্রকাশ
1. ZIP Extract করুন।
2. GitHub-এ `din-hacker-team-store` নামে Public repository তৈরি করুন।
3. ZIP-এর **সব ফাইল ও ফোল্ডার** repository root-এ আপলোড করুন। `index.html` root-এ আছে—`public/`-এর ভেতরে নয়।
4. Repository → Settings → Pages → Build and deployment → Deploy from a branch নির্বাচন করুন।
5. Branch `main`, folder `/ (root)` দিয়ে Save করুন। প্রকাশের URL GitHub Pages Settings-এ দেখা যাবে।

## Firebase-এর জন্য প্রয়োজনীয় সেটআপ
- Firebase Authentication-এ Anonymous এবং Email/Password provider enable করুন।
- Realtime Database ও Storage তৈরি করুন।
- `database.rules.json` এবং `storage.rules`-এ থাকা rules Firebase Console/CLI দিয়ে প্রয়োগ করুন।
- Admin account Firebase Authentication-এ তৈরি করুন; trusted Admin SDK/server environment দিয়ে ওই UID-তে `storeAdmin: true` custom claim দিতে হবে।
- `functions/` Firebase Cloud Functions-এ আলাদাভাবে deploy হবে; GitHub Pages Functions চালায় না.
- Cloud Functions secret `STORE_PASSWORD` সেট করতে `firebase functions:secrets:set STORE_PASSWORD` চালিয়ে secret দিন এবং `firebase deploy --only functions` করুন।
- Firebase project-এর জন্য Cloud Functions deploy করতে billing/Blaze plan প্রয়োজন হতে পারে।

## গুরুত্বপূর্ণ
GitHub Pages শুধু static front-end host করে। Password verification, authenticated file reads, upload/delete Firebase backend এবং Security Rules-এর ওপর নির্ভর করে। Deploy করার আগে Firebase Console-এ provider, rules, Storage bucket, database URL এবং admin custom claim যাচাই করুন।
Firebase web API key client config-এ থাকা স্বাভাবিক; এটি নিজে server secret নয়। Security Rules-ই access control করে।
