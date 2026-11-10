/**
 * Cherishing Moments — private caption service.
 * Deploy as a Web App: Execute as Me; access Anyone.
 * Store OPENAI_API_KEY in Project Settings > Script Properties.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Bridge')
    .setTitle('Cherishing Moments Caption Bridge')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function generateCaptions(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length < 1 || payload.items.length > 8) {
    throw new Error('Please send between 1 and 8 photographs.');
  }
  var apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing from Apps Script Script Properties.');
  var content = [{
    type: 'input_text',
    text: 'Write one distinct, natural photo caption for each image. Style: ' +
      String(payload.style || 'warm and meaningful') +
      '. Use only details clearly visible; do not guess names, locations, dates, relationships or events. ' +
      'Captions should be concise (about 8–18 words), specific to each photograph, respectful, and suitable to print below a personal photo collage. ' +
      'Return ONLY valid JSON in this exact shape: {"captions":[{"id":"same supplied id","caption":"caption"}]}.'
  }];
  payload.items.forEach(function(item) {
    if (!item.imageData || !/^data:image\/(jpeg|png|webp);base64,/.test(item.imageData)) {
      throw new Error('An image could not be prepared for captioning.');
    }
    content.push({type:'input_text', text:'Photo ID: ' + String(item.id) + '; file name: ' + String(item.name || 'Photo')});
    content.push({type:'input_image', image_url:item.imageData, detail:'low'});
  });
  var response = UrlFetchApp.fetch('https://api.openai.com/v1/responses', {
    method:'post',
    contentType:'application/json',
    headers:{Authorization:'Bearer ' + apiKey},
    payload:JSON.stringify({
      model:'gpt-4.1-mini',
      store:false,
      input:[{role:'user', content:content}],
      max_output_tokens:1200
    }),
    muteHttpExceptions:true
  });
  var status = response.getResponseCode();
  var body = response.getContentText();
  if (status < 200 || status >= 300) {
    throw new Error('OpenAI API error (' + status + '): ' + body.substring(0,500));
  }
  var data = JSON.parse(body);
  var output = '';
  (data.output || []).forEach(function(item) {
    if (item.type === 'message') (item.content || []).forEach(function(part) {
      if (part.type === 'output_text') output += part.text;
    });
  });
  var parsed;
  try { parsed = JSON.parse(output); }
  catch (e) { throw new Error('The caption model returned an unreadable response. Please try again.'); }
  if (!parsed.captions || !Array.isArray(parsed.captions)) throw new Error('No captions were returned.');
  var allowed = {};
  payload.items.forEach(function(item){ allowed[String(item.id)] = true; });
  return parsed.captions.filter(function(row){
    return row && allowed[String(row.id)] && typeof row.caption === 'string';
  }).map(function(row){
    return {id:String(row.id), caption:row.caption.substring(0,180)};
  });
}
