import { ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";

interface HomePageData {
  title: string;
  content?: string;
  metadata: any;
}

interface HomePageProps {
  data: HomePageData;
}

export default function HomePage({ data }: HomePageProps) {
  const reviews = {
    avatars: [
      { src: "https://github.com/shadcn.png", alt: "Avatar 1" },
      { src: "https://github.com/shadcn.png", alt: "Avatar 2" },
      { src: "https://github.com/shadcn.png", alt: "Avatar 3" },
    ],
    rating: 4.5,
    count: 100,
  };

  return (
    <section>
      <div className="container flex flex-col items-center">
        <div className="2xl:w-[calc(min(100vw-2*theme(container.padding),100%+8rem))] w-full overflow-clip rounded-lg">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="container flex flex-col items-center px-[4rem] py-16 text-center lg:mx-auto lg:items-start lg:px-[4rem] lg:py-32 lg:text-left">
              <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
                Welcome to Our Website
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
                doloremque mollitia fugiat omnis! Porro facilis quo animi
                consequatur. Explicabo.
              </p>
              <div className="flex w-full flex-col justify-center gap-8 md:gap-2 sm:flex-row lg:justify-start items-center">
                <Button className="w-full sm:w-auto">Primary</Button>
                <div className="mx-auto flex w-fit flex-col items-center gap-4 sm:flex-row">
                  <span className="inline-flex items-center ">
                    {reviews.avatars.map((avatar, index) => (
                      <Avatar key={index} className="size-10 border">
                        <AvatarImage src={avatar.src} alt={avatar.alt} />
                      </Avatar>
                    ))}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className="size-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="mr-1 font-semibold">
                        {reviews.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-left font-medium">
                      from {reviews.count}+ reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative aspect-7/8 h-full w-full">
                <div className="absolute top-[12%] right-[50%] flex aspect-square w-[24%] justify-center rounded-lg border border-border bg-accent"></div>
                <div className="absolute top-[36%] right-[50%] flex aspect-5/6 w-[40%] justify-center rounded-lg border border-border bg-accent"></div>
                <div className="absolute bottom-[36%] left-[54%] flex aspect-5/6 w-[40%] justify-center rounded-lg border border-border bg-accent"></div>
                <div className="absolute bottom-[12%] left-[54%] flex aspect-square w-[24%] justify-center rounded-lg border border-border bg-accent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
