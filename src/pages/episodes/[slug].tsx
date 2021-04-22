import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../services/api';
import { convertDurationToString } from '../../utils/convertDurationToString';
import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    duration: number;
    durationAsString: string;
    publishedAt: string;
    description: string;
    url: string;
    thumbnail: string;
}

type EpisodeProps = {
   episode: Episode;
}

export default function Episode({episode}: EpisodeProps){
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type='button'>
                        <img src="/arrow-left.svg" alt="voltar"/>
                    </button>
                </Link>
                <Image width={700}
                 height={160}
                 src={episode.thumbnail}
                 objectFit='cover'
                 />
                 <button type="button">
                     <img src="/play.svg" alt="tocar"/>
                 </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members} </span>
                <span>{episode.publishedAt} </span>
                <span>{episode.durationAsString} </span>
            </header>
            <div
             className={styles.description}
             dangerouslySetInnerHTML={{__html: episode.description}}
             />
              
            
        </div>

    )
}


export const getStaticPaths : GetStaticPaths = async () =>{
    return {
        paths: [],
        fallback:'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx)=>{
    const {slug} = await ctx.params;
    const {data} = await api.get(`/episodes/${slug}`)
    const episode ={
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        description: data.description,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {locale: ptBR,}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToString(Number(data.file.duration)),
        url: data.file.url,
        members: data.members,
    }
    return{
        props:{
            episode
        },
        revalidate: 60 * 60 * 24, //24 hours
    }
}