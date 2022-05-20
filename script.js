//Loading the uploaded image into constant imageUpload 

const imageUpload = document.getElementById('imageUpload')

/*
Ensuring Synchronous loading of different 
Models that we use in the project using Promise.all
*/

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

//Definition of start function

async function start() { 

  
  //Creating container to display the 
  //Canvas which holds Resultant Marked Image
  
  const div = document.getElementById('cont');
  div.textContent = 'loading'; //loading is displayed on UI
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)

  //Function Call to Load the labled images

  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas

  //After Loading all our models and Labling images
  //"Loaded" gets displayed on UI

   div.textContent = 'loaded';

  
  //Function EventListener for image Upload to specify the tasks
  //That should be executed when image is uploaded.
  

  imageUpload.addEventListener('change', async () => {
    
    //Removing the Previously uploaded images (if any)

    if (image) image.remove()
    if (canvas) canvas.remove()
    
    //Loading uploaded image into API usable format.
    
    image = await faceapi.bufferToImage(imageUpload.files[0])

    //Displaying Uploaded image in UI

    container.append(image)

    //Creating a canvas to display resultant 
    //marked image with rectangles around faces

    canvas = faceapi.createCanvasFromMedia(image)

    //Adding the canvas to UI

    container.append(canvas)

    //Resizing the canvas according to image uploaded

    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)

    
    //Finding all face detections from the uploaded photo by 
    //the model by considering FAce Landmarks and Face 
    //Descriptors
    

    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()

    //Resizing the Detections according to image Size

    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    //Storing all detections in "Results"

    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    //Drawing Boxes around found

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box

      //Drawing Boxes around the detected Face

      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}

//Function to load the names of Detected Faces


function loadLabeledImages() {

  //Loading Names of all the locally saved faces
  //in labled_images folder into an array "lables"

  //To add a new face , Enter the new person's 
  //name in this array and His/her face in labled_images Folder.
 const labels = ['Gopi', 'Hema', 'Pranay', 'Pujitha', 'Siddharth', 'Jashwanth', 'Kiran']

  //Label Images According to Their Names 

  return Promise.all(
    labels.map(async label => {

      //Create an array to store descriptions of all the faces in it.

      const descriptions = []

      for (let i = 1; i <= 2; i++) {

        //Finding descriptions of ith person from labels list.

        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

        //Pushing the descriptions into descriptions array.


        descriptions.push(detections.descriptor)
      }

      //returning all the label images' descriptions

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
