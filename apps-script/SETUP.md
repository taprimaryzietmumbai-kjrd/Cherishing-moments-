# ChatGPT captions setup

This backend keeps the OpenAI API key in Google Apps Script Script Properties. Never paste the key into the GitHub website or the browser app.

## 1. Create the Apps Script project
1. Open https://script.google.com/ and create a new standalone project named **Cherishing Moments Caption Service**.
2. Replace the contents of `Code.gs` with the contents of this folder's `Code.gs`.
3. Add an HTML file named **Bridge** (the filename must be exactly Bridge) and paste the contents of `Bridge.html`.

## 2. Add the private API key
1. In the Apps Script project, open **Project Settings**.
2. Under **Script Properties**, add:
   - Property: `OPENAI_API_KEY`
   - Value: your OpenAI API key
3. Save. Do not share this key or add it to GitHub.

The OpenAI API is billed separately from a ChatGPT subscription. Set a suitable API usage limit in your OpenAI Platform account.

## 3. Deploy the web app
1. Click **Deploy → New deployment**.
2. Select type **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy and authorize the script.
6. Copy the deployed URL ending in `/exec`.

The web app must be accessible to the browser because the photo studio is hosted on GitHub Pages. The OpenAI key remains server-side in Script Properties.

## 4. Connect the photo studio
1. Open the Cherishing Moments website.
2. Go to **Privacy & Backup**.
3. Paste the Apps Script `/exec` URL in **ChatGPT caption connection** and click **Save connection**.
4. Return to **Collage Studio**, select up to 8 uploaded photographs, and click **Generate Captions with ChatGPT**.
5. Review or edit the individual captions before creating the collage.

## Privacy and usage
- The browser resizes selected photos and sends them to your Apps Script service for caption generation.
- The service sends those images to the OpenAI API for analysis. Images are not added to the app's local photo library by this operation.
- Only the selected photos are sent. Linked remote images are not included.
- The backend asks the model not to infer identities, relationships, locations or dates.
- If you change the Apps Script code later, deploy a new version of the web app.
