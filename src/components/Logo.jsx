/** Λογότυπο του Degrid (public/logo.png): καπέλο αποφοίτησης με λάμπα και πλέγμα. Το πλάτος ρυθμίζεται από το size. */
export default function Logo({ size = 96 }) {
  return <img className="logo" src="/logo.png" alt="Degrid logo" width={size} height="auto" style={{ width: size, height: 'auto' }} />;
}
