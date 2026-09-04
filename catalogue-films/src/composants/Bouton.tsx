export type VarianteBouton = "primaire" | "secondaire" | "danger";


export interface BoutonProps {
  libelle: string;
  variante?: VarianteBouton;   // "primaire" par défaut
  desactive?: boolean;         // false par défaut
  onClick?: () => void;
}

const COLORS: Record<VarianteBouton, string> = { //class T selon les variante
  primaire: 'bg-green-500 text-white',
  secondaire: 'bg-yellow-400 text-black',
  danger: 'bg-red-500 text-white',
};



//appelle les classe selon les variante pr l 22
function Bouton({libelle, variante = "primaire", desactive = false, onClick} : BoutonProps){ //recup les props et met valeur par defaut
  return(
    <button disabled={desactive} onClick={onClick} className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2  ${COLORS[variante]}} 
    `}>
      {libelle}
    </button>
  );

}
export default Bouton


