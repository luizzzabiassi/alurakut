import { SiteClient } from 'datocms-client'

export default async function recebeRequests(req, res){
    if(req.method === 'POST'){
        const token = 'd30627873f2305b1b7e3e748c1d6b0'
        const client = new SiteClient(token);
        const regCriado = await client.items.create({
            itemType: "967666",
            ...req.body
            //title: "Comunidade Teste",
            //imageUrl: "https://github.com/luizzzabiassi.png",
            //creatorSlug: "luizzzabiassi"
        })
        console.log(regCriado);
        res.json({
            dados: 'Dados',
            regCriado: regCriado
        })
        return;
    }
    res.status(404).json({
        message: "Ainda não há nada no GET, somente no POST"
    })
}