export default function ArchiveTable({ title, leftTitle, rightTitle, leftItems, rightItems }) {
  return (
    <div className="archiveTable">
      <p>{title}</p>
      <div className="archiveGrid">
        <section>
          <h3>{leftTitle}</h3>
          {leftItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>
        <section>
          <h3>{rightTitle}</h3>
          {rightItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>
      </div>
    </div>
  );
}
