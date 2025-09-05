
to add a static style page to the html view:

In you template
 <link rel="stylesheet" href="/styles/styles.css">

In the server file
app.use("/styles", express.static(path.join(process.cwd(), "styles.css")));