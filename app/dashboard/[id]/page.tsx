type Props = {
  params: Promise<{
    id: string;
  }>;
};

const DashboardById = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div>
      Dashboard ID: {id}
      <br />
      <p></p>
    </div>
  );
};

export default DashboardById;
