import { LocalStorageTable } from "@yamori-design/react-components";

type StoragePageProps = {
  prefix: string;
};

export const StoragePage = ({ prefix }: StoragePageProps) => (
  <section className="storage-page">
    <h1>Local storage</h1>

    <LocalStorageTable className="storage-page__table" prefix={prefix} />
  </section>
);
