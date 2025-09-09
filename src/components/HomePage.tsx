interface HomePageData {
  title: string;
  content?: string;
  metadata: any;
}

interface HomePageProps {
  data: HomePageData;
}

export default function HomePage({ data }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
      {data.content && (
        <div className="prose max-w-none">
          <p>{data.content}</p>
        </div>
      )}
    </div>
  );
}
