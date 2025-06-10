# S3 File Browser

This is a file browser for AWS S3, made without AI and without UI libraries.

Features include:
- API credentials managed on the frontend
- Browse any region
- Browse any folder within any bucket
- Download files
- List view or icons view
- File type distinctions
- Internal navigation (back and forward)
- Editable address bar
- Page title reflects current folder
- Route caching so navigating between folders you've already clicked on is like native
- Refresh button to reload the current folder without reloading the page. The button always reflects when there is an internal fetch happening.
- Settings are stored in localStorage
- Navigation bar stays with you as you scroll but fades out to be less obtrusive

## Running the project

Make sure you have an `accessKeyId` and a `secretAccessKey` to access your own S3 buckets.

In the `backend` folder:
```
$ npm i
```
Then:
```
$ npm run dev
```

Likewise, in the `frontend` folder:
```
$ npm i
```
Then:
```
$ npm run dev
```

## Room for improvement
- Add image previews when in icons mode
- Sort files in table mode by each column
- View browser compatible files directly without having to download
- Drag and drop to upload new files
- Create folders and buckets
- Delete files and buckets
- Use S3 pre-signed URLs for downloading directly rather than streaming through our own server. Requires setting up CORS on the buckets themselves. (@aws-sdk/s3-request-presigner)
- Implement paging and infinite scrolling (each route currently capped at 1 page of max 1000 objects)
- Drag files into folders to move them
- Rename objects
- Select multiple files at once for operations like deleting, downloading, or moving
- Custom context menu when right clicking objects to act on them
- Duplicate files, copy and paste
- Add the rest of the AWS regions to the region dropdown (currently just the eu-* ones for simplicity)
- Make it responsive for mobile (currently breaks the nav bar and table view on mobile)
- Light mode
