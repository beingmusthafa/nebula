import express, { Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());

app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello world" });
});

app.get(
  "/api/get-home-slides",
  (req: Request, res: Response, next: NextFunction) => {
    res.json({
      images: [
        "https://picsum.photos/id/235/200/300",
        "https://picsum.photos/id/238/200/300",
        "https://picsum.photos/id/239/200/300",
      ],
    });
  }
);

app.get(
  "/api/get-home-courses",
  (req: Request, res: Response, next: NextFunction) => {
    res.json({
      courses: [
        {
          "id": 1,
          "title": "Once Upon a Time in the Midlands",
          "price": "$175.88",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 3.0,
        },
        {
          "id": 2,
          "title": "Angels & Demons",
          "price": "$198.77",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 2.8,
        },
        {
          "id": 3,
          "title": "Mondo Hollywood",
          "price": "$103.33",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 4.3,
        },
        {
          "id": 4,
          "title": "Angel on My Shoulder",
          "price": "$152.09",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 3.1,
        },
        {
          "id": 5,
          "title": "Night to Remember, A",
          "price": "$169.52",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 2.0,
        },
        {
          "id": 6,
          "title": "Harry Potter and the Order of the Phoenix",
          "price": "$174.01",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 3.3,
        },
        {
          "id": 7,
          "title": "Somewhere Between",
          "price": "$155.11",
          "thumbnail": "https://picsum.photos/id/239/200/200",
          "tutor": {
            "image": "https://picsum.photos/id/239/200/200",
            "name": "John Doe",
          },
          "rating": 4.1,
        },
      ],
    });
  }
);

app.get("/admin/get-users", (req: Request, res: Response) => {
  res.json({
    users: [
      {
        image:
          "https://images.unsplash.com/photo-1592334873219-42ca023e48ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3w3NjA4Mjc3NHx8ZW58MHx8fHx8",
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
      {
        image:
          "https://images.unsplash.com/photo-1592334873219-42ca023e48ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3w3NjA4Mjc3NHx8ZW58MHx8fHx8",
        name: "Jane Doe",
        email: "janedoe@gmail.com",
      },
      {
        image:
          "https://images.unsplash.com/photo-1592334873219-42ca023e48ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3w3NjA4Mjc3NHx8ZW58MHx8fHx8",
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
    ],
  });
});

app.listen(3000, () => {
  console.log("server started");
});
